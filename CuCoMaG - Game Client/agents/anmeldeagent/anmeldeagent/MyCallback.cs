using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;

namespace AnmeldeAgent
{
    class MyCallback : Callback
    {
        TupleSpace tupleSpace;
        String userName1;
        int session;
        int troublecounter;
        int complaincounter;
        bool troublemaker;
        Random random;

        public MyCallback(TupleSpace tupleSpace, int session)
        {
            this.tupleSpace = tupleSpace;
            userName1 = "";
            troublemaker = false;
            troublecounter = 0;
            complaincounter = 0;
            this.session = session;
            random = new Random();
        }

        //Eingangstuple:  (Name   | hatPartner)
        //                (String | boolean)

        public override bool Call(Callback.Command cmd, int seqnum, Collide.SQLSpaces.Tuple afterCmd, Collide.SQLSpaces.Tuple beforeCmd, bool isException)
        {
            lock (this)
            {
                Collide.SQLSpaces.Tuple tuple = tupleSpace.Take(afterCmd);
                              
                    userName1 = tuple.GetField(0).Value.ToString();
                    Console.WriteLine("Player name: " + userName1);

                    Collide.SQLSpaces.Tuple user1Roles = tupleSpace.Take(new Collide.SQLSpaces.Tuple(new Field[] { new Field(userName1), new Field(typeof(int)), new Field(typeof(int)) }));
                    if (user1Roles != null)
                    {
                        if (userName1.Equals((String)user1Roles.GetField(0).Value))
                        {
                            troublecounter = (int)user1Roles.GetField(1).Value;
                            complaincounter = (int)user1Roles.GetField(2).Value;
                        }  
                    }
                    if (troublecounter > complaincounter)
                    {
                        troublemaker = false;
                        complaincounter++;
                    }
                    else
                    {
                        troublemaker = true;
                        troublecounter++;
                    }
                    // OUTPUT:
                    //(Name|Session|troublemaker)
                    //(String|Int|bool)
                    Collide.SQLSpaces.Tuple tmp = new Collide.SQLSpaces.Tuple(new Field[] {
                    new Field(userName1),
                    new Field(session),
                    new Field(troublemaker)
                    });
                    tupleSpace.Write(tmp);


                    //OUTPUT:
                    //(Name|troublecounter|complaincounter)
                    //(String| Int | Int)
                    tmp = new Collide.SQLSpaces.Tuple(new Field[] {
                    new Field (userName1),
                    new Field (troublecounter),
                    new Field (complaincounter)});

                    tupleSpace.Write(tmp);


                    session++;
                    userName1 = "";

                    //Output:
                    //("SessionNumber"|session)
                    //( String |          int)
                    tupleSpace.Take(new Collide.SQLSpaces.Tuple(new Field[]{
                        new Field("SessionNumber"),
                        new Field(typeof(int))}));
                    tupleSpace.Write(new Collide.SQLSpaces.Tuple(new Field[]{
                        new Field("SessionNumber"),
                        new Field(session)}));


                    return false;

                

                
            }

        }
    }
}
