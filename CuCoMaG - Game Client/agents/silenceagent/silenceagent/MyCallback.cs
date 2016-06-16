using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.Timers;

namespace SilenceAgent
{
    class MyCallback : Callback
    {
        //List of items for each session
        public static List<Timer> timers;
        private List<int> silenceCounters;
        private List<int> silenceCounters2;
        private List<int> IDs;
        private List<int> phases;

        int answerQuality;
        string playerName;

        TupleSpace tupleSpace;
        int sessionNumber;

        int timerInterval = 90000; // 90 seconds

        //int timerInterval = 30000;

        public MyCallback(TupleSpace tupleSpace)
        {
            timers = new List<Timer>();
            silenceCounters = new List<int>();
            silenceCounters2 = new List<int>();
            IDs = new List<int>();
            phases = new List<int>();

            this.tupleSpace = tupleSpace;

            Collide.SQLSpaces.Tuple sessionTuple = tupleSpace.Read(new Collide.SQLSpaces.Tuple(new Field[]{
            new Field("SessionNumber"),
            new Field(typeof(int))}));

            if (sessionTuple == null)
            { sessionNumber = 1; }
            else
            { sessionNumber = (int)sessionTuple.GetField(1).Value; }
            //if (sessionNumber > 0)
            //{
            //    for (int i = 0; i < sessionNumber; i++)
            //    {
            //        timers.Add(new Timer());
            //        silenceCounters.Add(0);
            //        IDs.Add(0);
            //        phases.Add(0);
            //    }
            //}


        }

        /*
        * (Name   | Sentence Opener |Anfrage | Session# | Phase | ID  | Emotion | Geschimpft | Name.Schimpfcounter | Aggro | Name.AggroCounter | Thema  )
          (String | String          | String |int       | int   | int | int     | bool       | int                 | bool  | int               | String )
        */
        public override bool Call(Callback.Command cmd, int seqnum, Collide.SQLSpaces.Tuple afterCmd, Collide.SQLSpaces.Tuple beforeCmd, bool isException)
        {
            lock (this)
            {
                playerName = afterCmd.GetField(0).Value.ToString();
                int currentSession = (int)afterCmd.GetField(3).Value;
                int currentID = (int)afterCmd.GetField(5).Value;
                answerQuality = (int)afterCmd.GetField(4).Value;

                if (currentSession - sessionNumber + 1 > timers.Count)
                {
                    Timer newTimer = new Timer();

                    // Hook up the Elapsed event for the timer.
                    newTimer.Elapsed += new ElapsedEventHandler(OnTimedEvent);

                    // Set the Interval 
                    newTimer.Interval = timerInterval;
                    newTimer.Enabled = true;

                    // Keep the timer alive until the end of Main.
                    // GC.KeepAlive(newTimer);

                    timers.Add(newTimer);
                    IDs.Add(currentID);
                    phases.Add(answerQuality);
                    silenceCounters.Add(0);
                    silenceCounters2.Add(0);

                }

                timers[currentSession - sessionNumber].Stop();

                IDs[currentSession - sessionNumber] = currentID;
                phases[currentSession - sessionNumber] = answerQuality;
                if (!afterCmd.GetField(1).Value.ToString().Contains("Ping"))
                    silenceCounters[currentSession - sessionNumber] = 0;

                //Set back silence timer of the session, because something was said
                //Timer t = new Timer();
                //t.Interval = 10000;
                //t.Enabled = true;
                //GC.KeepAlive(t);
                //timers[currentSession - 1] = t;

                //timers[currentSession - 1].Stop();
                timers[currentSession - sessionNumber].Start();

                timers[currentSession - sessionNumber].Interval = timerInterval;
                timers[currentSession - sessionNumber].Enabled = true;


                Console.WriteLine("Reset timer for session: " + currentSession);
                Console.WriteLine("Playername = " + playerName);
                return false;
            }
        }

        private void OnTimedEvent(object source, ElapsedEventArgs e)
        {
            lock (this)
            {
                int session = 0;
                for (int i = 0; i < timers.Count; i++)
                {
                    if (((Timer)source).Equals(timers[i]))
                    {

                        session = i;
                        break;
                    }
                }



                silenceCounters[session] = silenceCounters[session] + 1;
                silenceCounters2[session] = silenceCounters2[session] + 1;

                if (answerQuality > 2)
                {
                    Console.WriteLine("4th silence tuple written: session: " + "\nanswerquality: " + answerQuality);
                    Console.WriteLine("name: " + playerName + "\nsession: " + (session + sessionNumber));
                    Collide.SQLSpaces.Tuple silenceEndTuple = new Collide.SQLSpaces.Tuple(
                            new Field[] {
                                    new Field(playerName),
                                    new Field(session+sessionNumber),
                                    new Field("Conversation Ended")
                            });


                    tupleSpace.Write(silenceEndTuple);
                }


                if (silenceCounters[session] == 4)
                {
                    answerQuality = 6;
                    phases[session] = answerQuality;
                    Collide.SQLSpaces.Tuple silenceTuple = new Collide.SQLSpaces.Tuple(
                            new Field[] {
                                    new Field(playerName),
                                    new Field("Ping"),
                                    new Field("Silence"+(silenceCounters[session])),
                                    new Field(session + sessionNumber),
                                    new Field(answerQuality),
                                    new Field(IDs[session] +1),
                                    new Field(0),
                                    new Field(false),
                                    new Field(0),
                                    new Field(false),
                                    new Field(0),
                                    new Field(""),
                                    new Field(false),
                                    new Field (0),
                                    new Field(false),
                                    new Field (0),
                                    new Field (0),
                                    new Field ((long)90000),
                                    new Field (true)
                                     });


                    tupleSpace.Write(silenceTuple);
                    Console.WriteLine("Silence-Tuple written!\n Request: " + silenceTuple.GetField(2).Value + "\nSilenceCounter: " + silenceCounters[session] + "\nSilencecounter2: " + silenceCounters2[session]);
                }



                //if (answerQuality < 3)
                //{

                if ((silenceCounters[session] < 4) && answerQuality < 3)
                {
                    Collide.SQLSpaces.Tuple silenceTuple = new Collide.SQLSpaces.Tuple(
                            new Field[] {
                                    new Field(playerName),
                                    new Field("Ping"),
                                    new Field("Silence"+(silenceCounters[session])),
                                    new Field(session + sessionNumber),
                                    new Field(0),
                                    new Field(IDs[session] +1),
                                    new Field(0),
                                    new Field(false),
                                    new Field(0),
                                    new Field(false),
                                    new Field(0),
                                    new Field(""),
                                    new Field(false),
                                    new Field (0),
                                    new Field(false),
                                    new Field (0),
                                    new Field (0),
                                    new Field ((long)90000),
                                    new Field (true)
                            });


                    tupleSpace.Write(silenceTuple);
                    Console.WriteLine("Silence-Tuple written!\n Request: " + silenceTuple.GetField(2).Value + "\nSilenceCounter: " + silenceCounters[session] + "\nSilencecounter2: " + silenceCounters2[session]);
                }
            }
        }
    }
}
