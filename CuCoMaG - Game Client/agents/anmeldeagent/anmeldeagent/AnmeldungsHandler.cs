using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.IO;

namespace AnmeldeAgent
{
    class AnmeldungsHandler
    {
        private TupleSpace tupleSpace;
        private int session;

        public AnmeldungsHandler()
        {
            StreamReader reader = new StreamReader("Connection.txt", System.Text.Encoding.Default);
            tupleSpace = new TupleSpace(reader.ReadLine().Replace("Host: ", ""), Convert.ToInt32(reader.ReadLine().Replace("Port: ", "")), this.ToString().Split('.')[0], "", new String[] { reader.ReadLine().Replace("SpaceName: ", "") }, false);
            reader.Close();
            Console.WriteLine(this.ToString().Split('.')[0] + ": Tuplespace Connected.");

            ////Alte Tuple-"Reste" aus dem Space entfernen, damit diese die Anmeldung nicht stören
            //tupleSpace.TakeAll(new Collide.SQLSpaces.Tuple(
            //    new Field[] { 
            //        new Field(typeof(string)), 
            //        new Field(false)}));
            //tupleSpace.TakeAll(new Collide.SQLSpaces.Tuple(new Field[] { 
            //        new Field(typeof(string)), 
            //        new Field(typeof(int)), 
            //        new Field(typeof(Boolean))  
            //        }));

            Collide.SQLSpaces.Tuple sessionTuple = tupleSpace.Read(new Collide.SQLSpaces.Tuple(new Field[]{
            new Field("SessionNumber"),
            new Field(typeof(int))}));

            if (sessionTuple == null)
            { session = 1; }
            else
            { session = (int)sessionTuple.GetField(1).Value; }

            RegisterCallback();
        }

        private void RegisterCallback()
        {
            //Eingangstuple:  (Name   | hatPartner)
            //                (String | boolean)

            // Create template
            Collide.SQLSpaces.Tuple template = new Collide.SQLSpaces.Tuple(
                new Field[] { 
                    new Field(typeof(string)), 
                    new Field(false)});

            // Create new callback instance
            Callback callback = new MyCallback(tupleSpace, session);

            // Register callback for tuple
            tupleSpace.EventRegister(Callback.Command.write, template, callback, true);

            Console.WriteLine("Event registered");
        }
    }
}

