using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.IO;

namespace ScoreAgent
{

    class ScoreAnalyse
    {
        private TupleSpace tupleSpace;

        public ScoreAnalyse()
        {
            StreamReader reader = new StreamReader("Connection.txt", System.Text.Encoding.Default);
            tupleSpace = new TupleSpace(reader.ReadLine().Replace("Host: ", ""), Convert.ToInt32(reader.ReadLine().Replace("Port: ", "")), this.ToString().Split('.')[0], "", new String[] { reader.ReadLine().Replace("SpaceName: ", "") }, false);
            //tupleSpace.DeleteAll(new Collide.SQLSpaces.Tuple());
            reader.Close();
            Console.WriteLine(this.ToString().Split('.')[0] + ": Tuplespace Connected.");
            //tupleSpace = new TupleSpace(reader.ReadLine().Replace("Host: ", ""), Convert.ToInt32(reader.ReadLine().Replace("Port: ", "")), this.ToString().Split('.')[0], "", new String[] { reader.ReadLine().Replace("SpaceName: ", "") }, false);
            //tupleSpace = new TupleSpace("balvenie.inf.uni-due.de", 2525, "SammelAgent","", new String[] {"COLCOMA"}, false);
            RegisterCallback();
        }

        private void RegisterCallback()
        {
            //Eingangstuple:  (Name   | SentenceOpener | Anfrage | Session# | Phase | ID)
            //                (String | String         | String  | int      | int   | int)

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
                    new Field(typeof(bool)),
                    new Field(typeof(string)),

            });

            // Create new callback instance
            Callback callback = new MyCallback(tupleSpace);

            // Register callback for tuple
            
            tupleSpace.EventRegister(Callback.Command.write, template, callback, true);
        }
    }
}
    