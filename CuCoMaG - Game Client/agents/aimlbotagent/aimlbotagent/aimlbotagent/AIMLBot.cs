using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using AIMLbot;
using System.IO;

namespace AIMLBotAgent
{
    class AIMLBot
    {
        private TupleSpace tupleSpace;
        private int sessionNumber;

        public AIMLBot() 
        {
            StreamReader reader = new StreamReader("Connection.txt", System.Text.Encoding.Default);
            tupleSpace = new TupleSpace(reader.ReadLine().Replace("Host: ", ""), Convert.ToInt32(reader.ReadLine().Replace("Port: ", "")), this.ToString().Split('.')[0], "", new String[] { reader.ReadLine().Replace("SpaceName: ", "") }, false);
            //tupleSpace.DeleteAll(new Collide.SQLSpaces.Tuple());
            reader.Close();
            Console.WriteLine(this.ToString().Split('.')[0] + ": Tuplespace Connected.");


            Collide.SQLSpaces.Tuple sessionTuple = tupleSpace.Read(new Collide.SQLSpaces.Tuple(new Field[]{
            new Field("SessionNumber"),
            new Field(typeof(int))}));

            if (sessionTuple == null)
            { sessionNumber = 1; }
            else
            { sessionNumber = (int)sessionTuple.GetField(1).Value; }

            RegisterCallback();
        }

        private void RegisterCallback()
        {
            /*Eingangstuple:
                (Name   | SentenceOpener |Anfrage | Session# | Phase | ID  | Emotion | Geschimpft | Name.Schimpfcounter | Aggro | Name.AggroCounter | Thema )
                (String | String         |String  | int      | int   | int | int     | bool       | int                 | bool  | int               | String)
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
                    new Field(typeof(bool)),
                    new Field(typeof(int)),
                    new Field(typeof(bool)),
                    new Field(typeof(int)),
                    new Field(typeof(int)),
                    new Field(typeof(long)),
                    new Field (typeof(bool))
            });

            // Create new callback instance
            Callback callback = new MyCallBack(tupleSpace, sessionNumber);

            // Register callback for tuple
            tupleSpace.EventRegister(Callback.Command.write, template, callback, true);
        }
    }
}
