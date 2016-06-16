using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.IO;

namespace SilenceAgent
{
    class SilenceAnalyse
    {
        private TupleSpace tupleSpace;

        public SilenceAnalyse()
        {
            StreamReader reader = new StreamReader("Connection.txt", System.Text.Encoding.Default);
            tupleSpace = new TupleSpace(reader.ReadLine().Replace("Host: ", ""), Convert.ToInt32(reader.ReadLine().Replace("Port: ", "")), this.ToString().Split('.')[0], "", new String[] { reader.ReadLine().Replace("SpaceName: ", "") }, false);
            reader.Close();
            Console.WriteLine(this.ToString().Split('.')[0] + ": Tuplespace Connected.");
            RegisterCallback();
        }

        private void RegisterCallback()
        {
            /*Eingangstuple:
               (Name   | SentenceOpener |Anfrage | Session# | Phase | ID  | Emotion | Geschimpft | Name.Schimpfcounter | Aggro | Name.AggroCounter | Thema  | Response)
               (String | String         |String  | int      | int   | int | int     | bool       | int                 | bool  | int               | String | String )
           */

            // Create template
            Collide.SQLSpaces.Tuple template = new Collide.SQLSpaces.Tuple(new Field[] { 
                    new Field(typeof(string)), 
                    new Field(typeof(string)),
                    new Field(typeof(string)),
                    new Field(typeof(int)),
                    new Field(typeof(int)),
                    new Field(typeof(int)),
                    new Field(typeof(int)),
                    new Field(typeof(bool)),
                    new Field(typeof(int)),
                    new Field(typeof(bool)),
                    new Field(typeof(int)),
                    new Field(typeof(string)),
                    new Field(typeof(string))
            });

            // Create new callback instance
            Callback callback = new MyCallback(tupleSpace);

            // Register callback for tuple
            tupleSpace.EventRegister(Callback.Command.write, template, callback, true);

            //Create template for tuple that will stop the timers
            Collide.SQLSpaces.Tuple endTuple = new Collide.SQLSpaces.Tuple(new Field[] {  
                new Field(typeof(string)), 
                new Field(typeof(int)), 
                new Field("Conversation Ended") });
            Callback endCallback = new StopTimerCallback(tupleSpace);
            tupleSpace.EventRegister(Callback.Command.write, endTuple, endCallback, true);
        }

    }
}
