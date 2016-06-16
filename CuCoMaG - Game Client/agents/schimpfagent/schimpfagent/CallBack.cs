using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.IO;

namespace SchimpfAgent
{
    class MyCallback: Callback
    {
        List<String> schimpfwortListe;
        TupleSpace tupleSpace;

        public MyCallback(TupleSpace tupleSpace)
        {
            this.tupleSpace = tupleSpace;
            LoadList();
        }

        // Baut Verbindung zur Test-Datei Schimpfwoerter (im Debug-Ordner) auf und überträgt alle dort eingetragenen Wörter in ein Array
        private void LoadList()
        {
            schimpfwortListe = new List<string>();
            string listPath = "Schimpfwoerter.txt";
            StreamReader reader = new StreamReader(listPath, System.Text.Encoding.Default);
            while (!reader.EndOfStream)
            { schimpfwortListe.Add(reader.ReadLine().ToLower()); }
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
            int session = (int) tuple.GetField(3).Value;
            int phase = (int) tuple.GetField(4).Value;
            int ID = (int) tuple.GetField(5).Value;

            long tupleID = tuple.TupleID.Id;

            bool geschimpft = false;
            int RudenessCounter = 0;
            //int SchmidtCounter = 0;

            //Add spaces at the beginning and the end so that words at the beginning and end are also matched correctly
            String tempRequest = " " + request.ToLower() + " ";

            if (!name.Equals(""))
            {
                Collide.SQLSpaces.Tuple counterTuple = tupleSpace.Take(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("Schimpf-Feedback"), new Field(name), new Field(typeof(int)) }));
               
                    if (counterTuple != null) { RudenessCounter = (int)counterTuple.GetField(3).Value; }
                    else
                        RudenessCounter = 0;
             
                foreach (String s in schimpfwortListe)
                {
                    if (tempRequest.Contains(s) ||
                        tempRequest.Contains(" " + s.Trim() + ".") ||
                        tempRequest.Contains(" " + s.Trim() + "!") ||
                        tempRequest.Contains(" " + s.Trim() + ",") ||
                        tempRequest.Contains(" " + s.Trim() + ";")   )
                    {                        
                        geschimpft = true;
                        
                            RudenessCounter++;
                            tupleSpace.Write(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("Schimpf-Feedback"), new Field(name), new Field(RudenessCounter) }));
                        
                        break;
                    }
                }
                if (!geschimpft)
                { tupleSpace.Write(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("Schimpf-Feedback"), new Field(name), new Field(RudenessCounter) })); }
            }
            /* Schimpfbot schreibt Tupel folgender Form:
             * - nicht geschimpft: 
             *      (Name | SentenceOpener | Anfrage | Session# | Phase | ID | Emotion | Geschimpft = false | Name.Schimpfcounter)
             * - geschimpft: 
             *      (Name | SentenceOpener | Anfrage | Session# | Phase | ID | Emotion | Geschimpft = true  | Name.Schimpfcounter) */

            Collide.SQLSpaces.Tuple tmp = new Collide.SQLSpaces.Tuple(
                    new Field[] { 
                    new Field(session),
                    new Field(ID),
                    new Field("Rudeness analysis"), 
                    new Field(geschimpft),
                    new Field(RudenessCounter),
                    new Field(tupleID)}); 
            tupleSpace.Write(tmp);

            Console.Write("Tuple geschrieben: Session: " + tmp.GetField(0) + "\nID: " + tmp.GetField(1) + "\nAnalyse: "
                      + tmp.GetField(2) + "\nGeschimpft: " + tmp.GetField(3) + "\nCounter: " + tmp.GetField(4) + "\nTupleID: " + tmp.GetField(5));

            return false;
        }

        
    }
}
