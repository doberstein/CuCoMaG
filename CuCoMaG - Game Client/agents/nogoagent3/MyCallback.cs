using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.IO;

namespace NoGoAgent3
{
    class MyCallback : Callback
    {
        List<String> politeList;
        TupleSpace tupleSpace;

        public MyCallback(TupleSpace tupleSpace)
        {
            this.tupleSpace = tupleSpace;
            LoadList();
        }

        // Baut Verbindung zur Test-Datei Schimpfwoerter (im Debug-Ordner) auf und überträgt alle dort eingetragenen Wörter in ein Array
        private void LoadList()
        {
            politeList = new List<string>();
            string listPath = "noGoList.txt";
            StreamReader reader = new StreamReader(listPath, System.Text.Encoding.Default);
            while (!reader.EndOfStream)
            { politeList.Add(reader.ReadLine().ToLower()); }
            reader.Close();
            Console.WriteLine("Reading List... complete.");
        }

        //Eingangstuple:  (Name   | SentenceOpener | Anfrage | Session# | Phase | ID )
        public override bool Call(Callback.Command cmd, int seqnum, Collide.SQLSpaces.Tuple afterCmd, Collide.SQLSpaces.Tuple beforeCmd, bool isException)
        {
            Collide.SQLSpaces.Tuple tuple = afterCmd;

            String name = tuple.GetField(0).Value.ToString();
            String sentenceOpener = tuple.GetField(1).Value.ToString();
            String request = tuple.GetField(2).Value.ToString();
            int session = (int)tuple.GetField(3).Value;
            int phase = (int)tuple.GetField(4).Value;
            int ID = (int)tuple.GetField(5).Value;

            long tupleID = tuple.TupleID.Id;

            bool polite = false;
            int NoGoCounter = 0;


            String tempRequest = " " + request.ToLower() + " ";

            if (!name.Equals(""))
            {
                Collide.SQLSpaces.Tuple counterTuple = tupleSpace.Take(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("NoGo-Feedback"), new Field(name), new Field(typeof(int)) }));
                
                    if (counterTuple != null) { NoGoCounter = (int)counterTuple.GetField(3).Value; }
                    else
                        NoGoCounter = 0;
                
                foreach (String s in politeList)
                {
                    if (tempRequest.Contains(s))
                    {
                        polite = true;
                        
                            NoGoCounter++;
                            tupleSpace.Write(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("NoGo-Feedback"), new Field(name), new Field(NoGoCounter) }));
                            Console.WriteLine("\n\nCounter: " + NoGoCounter + "\n\n");
                       
                        break;
                    }
                }
                if (!polite)
                { tupleSpace.Write(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("Polite-Feedback"), new Field(name), new Field( NoGoCounter ) })); }
            }
            Collide.SQLSpaces.Tuple tmp = new Collide.SQLSpaces.Tuple(
                    new Field[] {
                    new Field(session),
                    new Field(ID),
                    new Field("NoGo analysis"),
                    new Field(polite),
                    new Field(NoGoCounter),
                    new Field(tupleID)});
            tupleSpace.Write(tmp);

            Console.Write("Tuple written: Session: " + tmp.GetField(0) + "\nID: " + tmp.GetField(1) + "\nAnalyse: "
                      + tmp.GetField(2) + "\nNogo: " + tmp.GetField(3) + "\nCounter: " + tmp.GetField(4) + "\nTupleID: " + tmp.GetField(5));

            return false;
        }


    }
}
