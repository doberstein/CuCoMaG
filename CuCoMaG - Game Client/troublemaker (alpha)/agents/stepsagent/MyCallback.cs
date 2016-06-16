using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Collide.SQLSpaces;

namespace StepsAgent
{
    class MyCallback : Callback
    {

        TupleSpace tupleSpace;

        //Constructor
        public MyCallback(Collide.SQLSpaces.TupleSpace tupleSpace)
        {
            this.tupleSpace = tupleSpace;
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
            int stepCounter = 0;

            Collide.SQLSpaces.Tuple counterTuple = tupleSpace.Take(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("Steps-Feedback"), new Field(name), new Field(typeof(int)) }));
            if (counterTuple != null)
            {
                stepCounter = (int)counterTuple.GetField(3).Value;
            }
            else
                stepCounter = 0;


            stepCounter++;

            tupleSpace.Write(new Collide.SQLSpaces.Tuple(new Field[] { new Field(session), new Field("Steps-Feedback"), new Field(name), new Field(stepCounter) }));

            

            Collide.SQLSpaces.Tuple tmp = new Collide.SQLSpaces.Tuple(new Field[] {
                    new Field(session),
                    new Field(ID),
                    new Field("Step analyse"),
                    new Field (stepCounter),
                    new Field(tupleID)
                    });
            tupleSpace.Write(tmp);
            Console.Write("Tuple written: Session: " + tmp.GetField(0) + "\nID: " + tmp.GetField(1) + "\nAnalyse: "
                      + tmp.GetField(2) +  "\nStepCounter: " + tmp.GetField(3) + "\nTupleID: " + tmp.GetField(4));

            return false;
        } // Call

    }
}
