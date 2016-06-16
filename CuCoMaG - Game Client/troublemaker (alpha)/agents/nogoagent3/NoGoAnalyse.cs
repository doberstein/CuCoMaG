using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.IO;

namespace NogoAgent3
{
    class NogoAnalyse
    {
        private TupleSpace tupleSpace;

        public NogoAnalyse()
        {
            StreamReader reader = new StreamReader("Connection.txt", System.Text.Encoding.Default);
            tupleSpace = new TupleSpace(reader.ReadLine().Replace("Host: ", ""), Convert.ToInt32(reader.ReadLine().Replace("Port: ", "")), this.ToString().Split('.')[0], "", new String[] { reader.ReadLine().Replace("SpaceName: ", "") }, false);
            reader.Close();
            Console.WriteLine(this.ToString().Split('.')[0] + ": Tuplespace Connected.");
            RegisterCallback();
        }

        private void RegisterCallback()
        {
            /*Eingangstupel: 
             *      (Name   | SentenceOpener | Anfrage | Session# | Phase | ID  )
                    (String | String         | String  | int      | int   | int )         */

            // Create template
            Collide.SQLSpaces.Tuple template = new Collide.SQLSpaces.Tuple(
                new Field[] {
                    new Field(typeof(string)),
                    new Field(typeof(string)),
                    new Field(typeof(String)),
                    new Field(typeof(int)),
                    new Field(typeof(int)),
                    new Field(typeof(int))
                     });

            // Create new callback instance
            Callback callback = new NoGoAgent3.MyCallback(tupleSpace);

            // Register callback for tuple
            tupleSpace.EventRegister(Callback.Command.write, template, callback, true);
        }
    }
}
