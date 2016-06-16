using System;
//using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.IO;

namespace AggressionsAgent
{
    class MyCallback : Callback
    {
        List<String> aggroListe;
        TupleSpace tupleSpace;
        String pattern;

        public MyCallback(TupleSpace tupleSpace)
        {
            this.tupleSpace = tupleSpace;
            pattern = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZß";
            LoadList();
        }

        // Baut Verbindung zur Test-Datei aggression (im Debug-Ordner) auf und überträgt alle dort eingetragenen Wörter in ein Array
        private void LoadList()
        {
            aggroListe = new List<string>();
            string currentPath = System.Threading.Thread.GetDomain().BaseDirectory;
            string listPath = "aggression.txt";
            StreamReader reader = new StreamReader(listPath, System.Text.Encoding.Default);
            while (!reader.EndOfStream)
            {
                aggroListe.Add(reader.ReadLine().ToLower());
            }
            reader.Close();
            Console.WriteLine("Reading List... complete.");
        }

        //Eingangstuple:  (Name   | Sentenceopener | Anfrage | Session# | Phase | ID  )
        //                (String | String         | String  | int      | int   | int )

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

            bool aggressiv = false;
            int AggressionCounter = 0;
            

            if (!name.Equals("") )
            {
                Collide.SQLSpaces.Tuple counterTuple = tupleSpace.Take(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("Aggressions-Feedback"), new Field(name), new Field(typeof(int)) }));
                
                    if (counterTuple != null)
                    {
                        AggressionCounter = (int)counterTuple.GetField(3).Value;
                    }
                    else
                        AggressionCounter = 0;
                
                

                if (request.Contains("!!!"))
                {
                    aggressiv = true;
                }
                //Check whether text is completely written in capital letters (Caps-Lock)
                else if (request != "")
                {
                    int foundChars = 0;

                    foreach (char c in request)
                    {
                        if (pattern.IndexOf(c) > 0)
                            foundChars++;
                    }

                    if (foundChars > 1)
                    {
                        aggressiv = Regex.IsMatch(request, "[a-z]") ? false : true;
                    }

                    foreach (String s in aggroListe)
                    {
                        if (request.Contains(s))
                        {
                            aggressiv = true;
                        }
                    }
                }
                else
                {
                    aggressiv = false;
                }
                if (aggressiv)
                {
                        AggressionCounter++;
                        tupleSpace.Write(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("Aggressions-Feedback"), new Field(name), new Field(AggressionCounter) }));
                        Console.WriteLine("\n\nAggressionsCounter: " + AggressionCounter + "(" + name + ")\n\n");
                    
                }
                else
                {
                    tupleSpace.Write(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("Aggressions-Feedback"), new Field(name), new Field((AggressionCounter) )}));
                }
            }

            /* Aggressionsbot schreibt Tupel folgender Form: 
             * - nicht agressiv: 
             *       (Name | SentenceOpener | Anfrage | Session# | Phase | ID | Emotion | Geschimpft = false | Name.Schimpfcounter | Aggro = false | Name.AggroCounter)
             * - aggressiv: 
             *       (Name | SentenceOpener | Anfrage | Session# | Phase | ID | Emotion | Geschimpft = true  | Name.Schimpfcounter | Aggro = true  | Name.AggroCounter)
             */

            Collide.SQLSpaces.Tuple tmp = new Collide.SQLSpaces.Tuple(new Field[] {
                    new Field(session),
                    new Field(ID),
                    new Field("Aggression analysis"),
                    new Field(aggressiv),
                    new Field(AggressionCounter),
                    new Field(tupleID)
                    });
            tupleSpace.Write(tmp);

            Console.Write("Tuple written: Session: " + tmp.GetField(0) + "\nID: " + tmp.GetField(1) + "\nAnalyse: "
                      + tmp.GetField(2) + "\nAggressiv: " + tmp.GetField(3) + "\nCounter: " + tmp.GetField(4) + "\nTupleID: " + tmp.GetField(5));

            return false;
        }
    }
}
