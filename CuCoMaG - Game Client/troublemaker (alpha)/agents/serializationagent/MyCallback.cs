using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.Xml.Serialization;
using System.IO;
using System.Xml;
using System.Xml.Linq;

namespace SerializationAgent
{
    class MyCallback : Callback
    {
        private TupleSpace tupleSpace;
        //List<Message> messageList;
        //List<List<Message>> sessionList;
        List<Message>[] sessionArray;
        long[] overallTime;
        public MyCallback(TupleSpace tupleSpace)
        {
            this.tupleSpace = tupleSpace;
            //this.sessionList = new List<List<Message>>();
            this.sessionArray = new List<Message>[30];
            this.overallTime = new long[30];

        }

        //Eingangstuple:  (Name   | SentenceOpener | Anfrage | Session# | Phase | ID)
        //                (String | String         | String  | int      | int   | int)
        public override bool Call(Callback.Command cmd, int seqnum, Collide.SQLSpaces.Tuple afterCmd, Collide.SQLSpaces.Tuple beforeCmd, bool isException)
        {
            Collide.SQLSpaces.Tuple tuple = afterCmd;

            long tupleID = tuple.TupleID.Id;

            String name = tuple.GetField(0).Value.ToString();
            String sentenceOpener = tuple.GetField(1).Value.ToString();
            String request = tuple.GetField(2).Value.ToString();
            int session = (int)tuple.GetField(3).Value;
            int answerquality = (int)tuple.GetField(4).Value;
            int ID = (int)tuple.GetField(5).Value;
            int emotion = (int)tuple.GetField(6).Value;
            bool rudeness = (bool)tuple.GetField(7).Value;
            int rudenessCounter = (int)tuple.GetField(8).Value;
            bool aggression = (bool)tuple.GetField(9).Value;
            int aggressionCounter = (int)tuple.GetField(10).Value;
            String topic = tuple.GetField(11).Value.ToString();
            bool politeness = (bool)tuple.GetField(12).Value;
            int politenessCounter = (int)tuple.GetField(13).Value;
            bool nogo = (bool)tuple.GetField(14).Value;
            int nogoCounter = (int)tuple.GetField(15).Value;
            int stepCounter = (int)tuple.GetField(16).Value;
            long messageTime = (long)tuple.GetField(17).Value;
            bool silenceBool = (bool)tuple.GetField(18).Value;
            String botAnswer = tuple.GetField(19).Value.ToString();
            int score = (int)tuple.GetField(20).Value;
            // int answerquality = 6;
            bool serialized = false;




            Message m = new Message { MessageID = ID, PlayerName = name, SentenceOpener = sentenceOpener, PlayerInput = request, BotResponse = botAnswer, Aggression = aggression, Politeness = politeness, Rudeness = rudeness, NoGoSentence = nogo, MessageTime = messageTime, BotDelay = 30000, Answerquality = answerquality, SilenceTrigger = silenceBool, ScoreOverall = score };
            //sessionList.ElementAt(session).Add(m);
            if(sessionArray[session] == null)
            {
                Console.WriteLine("session array initialized");
                sessionArray[session] = new List<Message>();
            }
            sessionArray[session].Add(m);

            if (answerquality > 2)
            {
                try
                {
                    StringBuilder sb = new StringBuilder();
                    XmlWriterSettings xws = new XmlWriterSettings();
                    xws.OmitXmlDeclaration = true;

                    using (XmlWriter xw = XmlWriter.Create(sb, xws))
                    {

                        XElement Result = new XElement("Result");
                        XElement root = new XElement("Root");
                        overallTime[session] = 0; 
                      
                        foreach (Message m1 in sessionArray.ElementAt(session))
                        {
                            XElement message = new XElement("Message");
                            XElement MessageID = new XElement("MessageID", m1.MessageID);

                            XElement PlayerName = new XElement("PlayerName", m1.PlayerName);

                            XElement SentenceOpener = new XElement("SentenceOpener", "\"" + m1.SentenceOpener + "\"");
                            XElement PlayerInput = new XElement("PlayerInput", "\"" + m1.PlayerInput + "\"");
                            XElement BotResponse = new XElement("BotResponse", "\"" + m1.BotResponse + "\"");
                            XElement Aggression = new XElement("Aggression", m1.Aggression);
                            XElement Politeness = new XElement("Politeness", m1.Politeness);
                            XElement Rudeness = new XElement("Rudeness", m1.Rudeness);
                            XElement NoGoSentence = new XElement("NoGoSentence", m1.NoGoSentence);
                            XElement MessageTime = new XElement("MessageTime", m1.MessageTime);
                            XElement BotDelay = new XElement("BotDelay", 2000);
                            XElement Answerquality = new XElement("Answerquality", m1.Answerquality);
                            XElement SilenceTrigger = new XElement("SilenceTrigger", m1.SilenceTrigger);
                            XElement ScoreOverall = new XElement("ScoreOverall", m1.ScoreOverall);


                            message.Add(MessageID);
                            message.Add(PlayerName);
                            message.Add(SentenceOpener);
                            message.Add(PlayerInput);
                            message.Add(BotResponse);
                            message.Add(Aggression);
                            message.Add(Politeness);
                            message.Add(Rudeness);
                            message.Add(NoGoSentence);
                            message.Add(MessageTime);
                            message.Add(BotDelay);
                            message.Add(Answerquality);
                            message.Add(SilenceTrigger);
                            message.Add(ScoreOverall);
                            root.Add(message);

                            overallTime[session] = overallTime[session] + m1.MessageTime + 2000;
                        }

                        XElement ResultPlayerName = new XElement("PlayerName", name);
                        XElement ResultQuality = new XElement("ResultQuality", answerquality);

                        XElement AnswerAmount = new XElement("AnswerAmount", ID);
                        XElement OverallTime_output = new XElement("OverallTime", overallTime[session]);
                        Result.Add(ResultPlayerName);
                        Result.Add(ResultQuality);
                        Result.Add(AnswerAmount);
                        Result.Add(OverallTime_output);


                        root.Add(Result);

                        root.Save(xw);
                    }
                    string xmlstring = sb.ToString();
                    Console.WriteLine(sb.ToString());
                    //string filename = "Playerdata\\" + name + "_" + session + "_.xml";
                    string filename = name + "_" + session + "_.xml";

                    StreamWriter sw = new StreamWriter(filename);
                    sw.Write(xmlstring);
                    sw.Close();

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }




            //Schreibt Tuple der Form:  
            //     (Name   | SentenceOpener | Anfrage | Session# | Phase | ID  | Emotion | Geschimpft | Name.Schimpfcounter | Aggression | Name.AggressionsCounter | Thema )
            //     (String | String         | String  | int      | int   | int | int     | boolean    | int                 | boolean    | int                     | String)

            Collide.SQLSpaces.Tuple tmp = new Collide.SQLSpaces.Tuple(new Field[] {
                    new Field(name),
                    new Field(sentenceOpener),
                    new Field(request),
                    new Field(session),
                    new Field(answerquality),
                    new Field(ID),
                    new Field(emotion),
                    new Field(rudeness),
                    new Field(rudenessCounter),
                    new Field(aggression),
                    new Field(aggressionCounter),
                    new Field(topic),
                    new Field(politeness),
                    new Field(politenessCounter),
                    new Field(nogo),
                    new Field(nogoCounter),
                    new Field(stepCounter),
                    new Field(messageTime),
                    new Field(botAnswer),
                    new Field(score),
                    new Field(serialized)
                    });
            tupleSpace.Write(tmp);

            Console.Write("Tuple written: Name: " + tmp.GetField(0) + "\nSO: " + tmp.GetField(1) + "\nAnfrage: "
                      + tmp.GetField(2) + "\nSession: " + tmp.GetField(3) + "\nPhase: " + tmp.GetField(4) + "\nID: " + tmp.GetField(5)
                      + "\nEmotion: " + tmp.GetField(6) + "\nGeschimpft: " + tmp.GetField(7) + "\nCounter: " + tmp.GetField(8)
                      + "\nAggressiv: " + tmp.GetField(9) + "\nCounter: " + tmp.GetField(10) + "\nThema: " + tmp.GetField(11)
                      + "\nPolite: " + tmp.GetField(12) + "\nCounter: " + tmp.GetField(13));

            return false;
        }
    }
}
