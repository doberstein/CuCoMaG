using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;

namespace SilenceAgent
{
    class StopTimerCallback: Callback
    {
        private int sessionNumber;

        public StopTimerCallback(TupleSpace tupleSpace)
        {
            Collide.SQLSpaces.Tuple sessionTuple = tupleSpace.Read(new Collide.SQLSpaces.Tuple(new Field[]{
            new Field("SessionNumber"),
            new Field(typeof(int))}));

            if (sessionTuple == null)
            { sessionNumber = 1; }
            else
            { sessionNumber = (int)sessionTuple.GetField(1).Value; }
        }
        public override bool Call(Callback.Command cmd, int seqnum, Collide.SQLSpaces.Tuple afterCmd, Collide.SQLSpaces.Tuple beforeCmd, bool isException)
        {
            Console.WriteLine("wird aufgerufen für timer:" + ((int)afterCmd.GetField(1).Value - sessionNumber));
            if (MyCallback.timers.Count > (int)afterCmd.GetField(1).Value - sessionNumber) { 
                Console.WriteLine("call close");
                MyCallback.timers[(int)afterCmd.GetField(1).Value-sessionNumber].Close();
            }
            return false;
        }
    }
}
