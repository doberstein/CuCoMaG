using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;

namespace SammelAgent
{
    class MyCallback: Callback
    {
        private TupleSpace tupleSpace;

        public MyCallback(TupleSpace tupleSpace)
        {
            this.tupleSpace = tupleSpace;
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
            int phase = (int)tuple.GetField(4).Value;
            int ID = (int)tuple.GetField(5).Value;

            //Read result tuple of the preprocessing agents
           
               Collide.SQLSpaces.Tuple rudenessTuple = null;
               Collide.SQLSpaces.Tuple aggressionTuple =null;
               Collide.SQLSpaces.Tuple emotionTuple=null;
               Collide.SQLSpaces.Tuple themeTuple=null;
               Collide.SQLSpaces.Tuple politeTuple = null;
               Collide.SQLSpaces.Tuple nogoTuple = null;
               Collide.SQLSpaces.Tuple stepTuple = null;
               Collide.SQLSpaces.Tuple MessageTimeTuple = null;

            MessageTimeTuple = tupleSpace.WaitToTake(
          new Collide.SQLSpaces.Tuple(
              new Field[] { new Field(name), new Field(session), new Field(ID), new Field("MessageTimeAnalysis"), new Field(typeof(int)) }), 200, new String[] { "COLCOMA" });

            int MessageTime = MessageTimeTuple != null ? (int)MessageTimeTuple.GetField(4).Value : 0;

            stepTuple = tupleSpace.WaitToTake(
          new Collide.SQLSpaces.Tuple(
              new Field[] { new Field(session), new Field(ID), new Field("Step analyse"), new Field(typeof(bool)), new Field(typeof(int)), new Field(tupleID) }), 200, new String[] { "COLCOMA" });
            int stepCounter = stepTuple != null ? (int)stepTuple.GetField(3).Value : 0;

            nogoTuple = tupleSpace.WaitToTake(
          new Collide.SQLSpaces.Tuple(
              new Field[] { new Field(session), new Field(ID), new Field("NoGo analysis"), new Field(typeof(bool)), new Field(typeof(int)), new Field(tupleID) }), 200, new String[] { "COLCOMA" });
            bool nogo = nogoTuple != null ? (bool)nogoTuple.GetField(3).Value : false;
            int nogoCounter = nogoTuple != null ? (int)nogoTuple.GetField(4).Value : 0;

            rudenessTuple = tupleSpace.WaitToTake(
                      new Collide.SQLSpaces.Tuple(
                          new Field[] { new Field(session), new Field(ID), new Field("Rudeness analysis"), new Field(typeof(bool)), new Field(typeof(int)), new Field(tupleID) }), 200, new String[] { "COLCOMA" });
               bool rudeness = rudenessTuple!= null ? (bool)rudenessTuple.GetField(3).Value : false;
               int rudenessCounter = rudenessTuple!=null? (int)rudenessTuple.GetField(4).Value : 0;

            politeTuple = tupleSpace.WaitToTake(
                    new Collide.SQLSpaces.Tuple(
                new Field[] { new Field(session), new Field(ID), new Field("Politeness analysis"), new Field(typeof(bool)), new Field(typeof(int)), new Field(tupleID) }), 200, new String[] { "COLCOMA" });
            bool politeness = politeTuple != null ? (bool)politeTuple.GetField(3).Value : false;
            int politenessCounter = politeTuple != null ? (int)politeTuple.GetField(4).Value : 0;

            aggressionTuple = tupleSpace.WaitToTake(
                      new Collide.SQLSpaces.Tuple(
                          new Field[] { new Field(session), new Field(ID), new Field("Aggression analysis"), new Field(typeof(bool)), new Field(typeof(int)), new Field(tupleID) }), 200, new String[] { "COLCOMA" });
               bool aggression = aggressionTuple!= null? (bool)aggressionTuple.GetField(3).Value : false;
               int aggressionCounter = aggressionTuple != null ? (int)aggressionTuple.GetField(4).Value : 0;

               emotionTuple = tupleSpace.WaitToTake(
                        new Collide.SQLSpaces.Tuple(
                            new Field[] { new Field(session), new Field(ID), new Field("Visual analysis"), new Field(typeof(int)), new Field(tupleID) }), 200, new String[] { "COLCOMA" });
               int emotion = emotionTuple!= null? (int)emotionTuple.GetField(3).Value : 0;

               themeTuple = tupleSpace.WaitToTake(
                        new Collide.SQLSpaces.Tuple(
                            new Field[] { new Field(session), new Field(ID), new Field("Themes analysis"), new Field(typeof(String)), new Field(tupleID) }), 200, new String[] { "COLCOMA" });
               String topic = themeTuple != null ? themeTuple.GetField(3).Value.ToString() : "";


               //Schreibt Tuple der Form:  
               //     (Name   | SentenceOpener | Anfrage | Session# | Phase | ID  | Emotion | Geschimpft | Name.Schimpfcounter | Aggression | Name.AggressionsCounter | Thema )
               //     (String | String         | String  | int      | int   | int | int     | boolean    | int                 | boolean    | int                     | String)

               Collide.SQLSpaces.Tuple tmp = new Collide.SQLSpaces.Tuple(new Field[] { 
                    new Field(name),
                    new Field(sentenceOpener),
                    new Field(request), 
                    new Field(session), 
                    new Field(phase),
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
                    new Field((long)MessageTime),
                    new Field(false)
                    });
               tupleSpace.Write(tmp);

            Console.Write("Tuple geschrieben: Name: " + tmp.GetField(0) + "\nSO: " + tmp.GetField(1) + "\nAnfrage: "
                      + tmp.GetField(2) + "\nSession: " + tmp.GetField(3) + "\nanswerQuality: " + tmp.GetField(4) + "\nID: " + tmp.GetField(5)
                      + "\nEmotion: " + tmp.GetField(6) + "\nGeschimpft: " + tmp.GetField(7) + "\nCounter: " + tmp.GetField(8)
                      + "\nAggressiv: " + tmp.GetField(9) + "\nCounter: " + tmp.GetField(10) + "\nThema: " + tmp.GetField(11)
                      + "\nPolite: " + tmp.GetField(12) + "\nCounter: " + tmp.GetField(13) + "\nMessageTime: " + MessageTime +"\nSilencetrigger: " + false);
 
            return false;
        }
    }
}
