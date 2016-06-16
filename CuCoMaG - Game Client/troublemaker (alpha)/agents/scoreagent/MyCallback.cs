using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.Threading;

namespace ScoreAgent
{
    class MyCallback : Callback
    {
        private TupleSpace tupleSpace;
        int[] score;

        public MyCallback(TupleSpace tupleSpace)
        {
            this.tupleSpace = tupleSpace;
            this.score = new int[30];
        }

        public override bool Call(Callback.Command cmd, int seqnum, Collide.SQLSpaces.Tuple afterCmd, Collide.SQLSpaces.Tuple beforeCmd, bool isException)
        {
            //Read (don't take!) tuple that has started the Callback
            Collide.SQLSpaces.Tuple tuple = tupleSpace.Read(afterCmd);

            //Read all important information
            String playerName = tuple.GetField(0).Value.ToString();

            String sentenceOpener = tuple.GetField(1).Value.ToString();
            String requestText = tuple.GetField(2).Value.ToString();
            String requestSentence = sentenceOpener + requestText;
            int session = (int)tuple.GetField(3).Value;
            int answerquality = (int)tuple.GetField(4).Value;
            int ID = (int)tuple.GetField(5).Value;
            int emotion = (int)tuple.GetField(6).Value;
            bool geschimpft = (bool)tuple.GetField(7).Value;
            int swearwordCounter = (int)tuple.GetField(8).Value;
            bool aggressiv = (bool)tuple.GetField(9).Value;
            int aggressionCounter = (int)tuple.GetField(10).Value;
            String theme = tuple.GetField(11).Value.ToString();
            bool polite = (bool)tuple.GetField(12).Value;
            int politenesscounter = (int)tuple.GetField(13).Value;
            bool nogo = (bool)tuple.GetField(14).Value;
            int nogoCounter = (int)tuple.GetField(15).Value;
            int stepCounter = (int)tuple.GetField(16).Value;
            long MessageTime = (long)tuple.GetField(17).Value;
            bool silencetrigger = (bool)tuple.GetField(18).Value;
            String response = tuple.GetField(19).Value.ToString();


            //politeness muss noch weiter mit übergeben werden das hab ich noch nicht vervollständigt 
            // timer und sowas ist noch nicht vollständig damit das gut wird brauch ich noch Zeit weil das aufeinander aufbaut... 
            // I still have to add things that dorian did and so on thats the reason why here is no timer and stuff
            decimal writingSpeed;
            if (MessageTime > 0)
            {
                writingSpeed = 1000 * requestSentence.Length / MessageTime;
            }
            else
            {
                writingSpeed = requestSentence.Length;

            }
            int writeSpeed = (int)Math.Round(writingSpeed);

            // add message time to score
            score[session] = score[session] + (int)writeSpeed;

            if (geschimpft)
            {
                score[session] = score[session] - 50;
            }
            if (aggressiv)
            {
                score[session] = score[session] - 30;
            }
            if (nogo)
            {
                score[session] = score[session] - 10;
            }
            if (polite)
            {
                score[session] = score[session] + 50;
            }
            if (stepCounter > 0)
            {
                score[session] = score[session] - stepCounter;
            }
            if (answerquality == 0)
            {
                score[session] = score[session] - 20;
            }
            else if (answerquality == 1)
            {
                score[session] = score[session];
            }
            else if (answerquality == 2)
            {
                score[session] = score[session] + 20;
            }
            else if (answerquality == 3)
            {
                score[session] = score[session] + 100;
            }
            else if (answerquality == 4)
            {
                score[session] = score[session];
            }
            else if (answerquality == 5)
            {
                score[session] = score[session] - 100;
            }
            else if (answerquality == 6)
            {
                score[session] = score[session];
            }
            if (silencetrigger)
            {
                score[session] = score[session] - 10;
            }
            /*
            int scor = 50 + writeSpeed - 10 * swearwordCounter - 5 * aggressionCounter + 5 * politenesscounter - 5 * nogoCounter - stepCounter;*/

            Console.Write("\n Score: " + score[session]);

            Collide.SQLSpaces.Tuple phaseStarter = new Collide.SQLSpaces.Tuple(
                                new Field[] {
                                    new Field(playerName),
                                    new Field(sentenceOpener),
                                    new Field(requestText),
                                    new Field(session),
                                    new Field(answerquality),
                                    new Field(ID),
                                    new Field(emotion),
                                    new Field(geschimpft),
                                    new Field(swearwordCounter),
                                    new Field(aggressiv),
                                    new Field(aggressionCounter),
                                    new Field(theme),
                                    new Field(polite),
                                    new Field(politenesscounter),
                                    new Field(nogo),
                                    new Field(nogoCounter),
                                    new Field(stepCounter),
                                    new Field(MessageTime),
                                    new Field(silencetrigger),
                                    new Field(response),
                                    new Field(score[session])
                            });
            tupleSpace.Write(phaseStarter);
            return false;
        }
    }
}
