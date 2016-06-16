using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using AIMLbot;
using System.IO;
using System.Threading;
using System.Collections;


namespace AIMLBotAgent
{
    class MyCallBack : Callback
    {
        #region Private Members

        TupleSpace tupleSpace;
        int numberOfSessions;
        List<Bot> myBots;

        List<User> myUsers;

        List<int> IDs;
        //Request request;
        //Result result;
        AIMLbot.Utils.AIMLLoader loader;

        int oldNumberOfSessions;


        //Variables for Themes   //"einen Vorschlag machen"
        Hashtable themes;
        List<List<String>> themesOnAgenda;
        List<String> refusedTheme = new List<string>() { "" };

        #endregion

        public MyCallBack(TupleSpace tupleSpace, int sessionNumber)
        {
            this.tupleSpace = tupleSpace;

            myUsers = new List<User>();
            myBots = new List<Bot>();

            IDs = new List<int>();

            oldNumberOfSessions = sessionNumber;
            numberOfSessions = sessionNumber - 1;

            themes = new Hashtable();
            string listPath = "themes.txt";
            StreamReader reader = new StreamReader(listPath, System.Text.Encoding.Default);
            String line;
            while (!reader.EndOfStream)
            {
                line = reader.ReadLine();
                themes.Add(line, 0);
            }
            reader.Close();
            Console.WriteLine("Reading themelist... complete.");

            themesOnAgenda = new List<List<string>>();
        }

        /*Eingangstuple:
                (Name   | SentenceOpener | Anfrage | Session# | Phase | ID  | Emotion | Geschimpft | Name.Schimpfcounter | Aggro | Name.AggroCounter | Thema )
                (String | String         | String  | int      | int   | int | int     | bool       | int                 | bool  | int               | String)
        */
        public override bool Call(Callback.Command cmd, int seqnum, Collide.SQLSpaces.Tuple afterCmd, Collide.SQLSpaces.Tuple beforeCmd, bool isException)
        {
            lock (this)
            {
                Request request;
                Result result;
                String helper;

                int ID;

                //Take tuple that has started the Callback
                Collide.SQLSpaces.Tuple tuple = tupleSpace.Take(afterCmd);

                //Read all important information
                String playerName = tuple.GetField(0).Value.ToString();
                String sentenceOpener = tuple.GetField(1).Value.ToString();
                String requestText = tuple.GetField(2).Value.ToString();
                String requestSentence = sentenceOpener + requestText;
                int currentSessionNumber = (int)tuple.GetField(3).Value;
                int phase = (int)tuple.GetField(4).Value;
 //               int ID = (int)tuple.GetField(5).Value;
                bool geschimpft = (bool)tuple.GetField(7).Value;
                bool aggressiv = (bool)tuple.GetField(9).Value;
                bool polite = (bool)tuple.GetField(12).Value;
                bool nogo = (bool)tuple.GetField(14).Value;
                int politenesscounter = (int)tuple.GetField(13).Value;
                int nogoCounter = (int)tuple.GetField(15).Value;
                int stepCounter = (int)tuple.GetField(16).Value;
                String theme = tuple.GetField(11).Value.ToString();
                long MessageTime = (long)tuple.GetField(17).Value;
                bool silenceBool = (bool)tuple.GetField(18).Value;

                // int stepcounter = (int)tuple.GetField(16).Value;        

                //Check whether a new Bot is needed due to a new Session
                if (currentSessionNumber > numberOfSessions)
                {
                    //Create new Bot and set settings
                    Bot myBot = new Bot();
                    //myBot.loadSettings(Path.Combine(Environment.CurrentDirectory, Path.Combine("config", "Settings.txt")));
                    try
                    {
                        myBot.loadSettings("config\\Settings.txt");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                    myBot.isAcceptingUserInput = true;
                    myBot.MaxThatSize = 99999999;

                    User myUser = new User("User", myBot);

                    loader = new AIMLbot.Utils.AIMLLoader(myBot);
                    //loader.loadAIML(Path.Combine(Environment.CurrentDirectory, "AIML"));
                    loader.loadAIML("aiml");

                    //add Bot and User to collections
                    myBots.Add(myBot);
                    myUsers.Add(myUser);

                    numberOfSessions = currentSessionNumber;
                    Console.WriteLine("New Bot started successfully. Number: " + currentSessionNumber);

                    //Write welcome message of the bot
                    String botAnswer = (myBot.Chat(new Request(requestSentence, myUser, myBot))).Output;

                    themesOnAgenda.Add(new List<string>());
                    refusedTheme.Add("");

                    IDs.Add(0);
                }
                if (!playerName.Equals(""))
                {
                    String botAnswer = "";
                    //Pick right Bot and User regarding to the session
                    Bot myBot = myBots[currentSessionNumber - oldNumberOfSessions];
                    User myUser = myUsers[currentSessionNumber - oldNumberOfSessions];

                    IDs[currentSessionNumber - oldNumberOfSessions]++;

                    //Check whether bot request has to be adapted
                    if (geschimpft) { 
                        request = new Request("RUDENESS", myUser, myBot); //if player was rude 
                    }
                    else if (aggressiv)
                    {
                        request = new Request("AGGRESSION", myUser, myBot); //if player was aggressive
                    }                
                    else
                    {
                        request = new Request(requestSentence, myUser, myBot);  //else request sentence is not changed
                    }

                    //Here the response of the bot is requested:
                    try
                    {
                        request.rawInput = request.rawInput.Replace("ä", "ae").Replace("ö", "oe").Replace("ü", "ue");
                        result = myBot.Chat(request);
                        Console.WriteLine("Bot receives request:\n          " + request.rawInput);
                        botAnswer = result.Output;
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.StackTrace);
                    }

                    //In the following cases the last statement of the Bot will be repeated after a reprehension due to silence, rudeness or aggression; because we
                    //only want to repeat the last sentence, not the whole statement, the botAnswer has to be adapted:
                    if (sentenceOpener.Equals("Ping") && !requestSentence.ToLower().Contains("silence4")
                        || geschimpft
                        || aggressiv )
                    {
                        helper = botAnswer;
                        String[] tempArray = helper.Split(new char[] { ':' });
                        botAnswer = tempArray[0] + ":";
                        String endOfSentence = tempArray[tempArray.Length - 1];
                        tempArray = endOfSentence.Split(new char[] { '.' });
                        botAnswer = botAnswer + (tempArray[tempArray.Length - 1].Equals("") ? tempArray[tempArray.Length - 2] + "." : tempArray[tempArray.Length - 1]);
                    }
                    /*
                    if (sentenceOpener.Equals("Ping"))
                    {
                        if (botAnswer.ToLower().Contains("user1"))
                        {
                            sentenceOpener = "Ping: Hr. Meier";
                            botAnswer=botAnswer.Replace("User1", "");
                        }
                        else if (botAnswer.ToLower().Contains("user2"))
                        {
                            sentenceOpener = "Ping: Fr. Schmidt";
                            botAnswer=botAnswer.Replace("User2", "");
                        }
                        else { botAnswer= botAnswer.Replace("alle", ""); }
                    }*/


                    ID = IDs[currentSessionNumber - oldNumberOfSessions];

                    /*AIMLBot schreibt:
                       (Name   | SentenceOpener | Anfrage | Session# | Phase | ID  | Emotion | Geschimpft | Name.Schimpfcounter | Aggro | Name.AggroCounter | Thema  | Response)
                       (String | String         | String  | int      | int   | int | int     | bool       | int                 | bool  | int               | String | String)
                    */

                    // wait to answer (BotDelay)
                    Thread.Sleep(2000);
                    Collide.SQLSpaces.Tuple tmp = new Collide.SQLSpaces.Tuple(
                        new Field[] { 
                    new Field(playerName),//.Equals("Ping")? "": playerName), 
                    new Field(sentenceOpener), 
                    new Field(requestText), 
                    new Field(currentSessionNumber),
                    new Field(phase),
                    new Field(ID),
                    new Field((int)tuple.GetField(6).Value),
                    new Field(geschimpft),
                    new Field((int)tuple.GetField(8).Value),
                    new Field(aggressiv),
                    new Field((int)tuple.GetField(10).Value),
                    new Field(theme),
                    new Field(botAnswer),
                    });

                    tupleSpace.Write(tmp);

                    Collide.SQLSpaces.Tuple tmp2 = new Collide.SQLSpaces.Tuple(
    new Field[] {
                    new Field(playerName),//.Equals("Ping")? "": playerName), 
                    new Field(sentenceOpener),
                    new Field(requestText),
                    new Field(currentSessionNumber),
                    new Field(phase),
                    new Field(ID),
                    new Field((int)tuple.GetField(6).Value),
                    new Field(geschimpft),
                    new Field((int)tuple.GetField(8).Value),
                    new Field(aggressiv),
                    new Field((int)tuple.GetField(10).Value),
                    new Field(theme),
                    new Field(polite),
                    new Field(politenesscounter),
                    new Field(nogo),
                    new Field(nogoCounter),
                    new Field(stepCounter),
                    new Field(MessageTime),
                    new Field(silenceBool),
                    new Field(botAnswer),
});

                    tupleSpace.Write(tmp2);

                    Console.Write("\nTuple geschrieben: Name: " + tmp.GetField(0) + "\nSO: " + tmp.GetField(1) + "\nAnfrage: "
                              + tmp.GetField(2) + "\nSession: " + tmp.GetField(3) + "\nPhase: " + tmp.GetField(4) + "\nID: " + tmp.GetField(5)
                              + "\nEmotion: " + tmp.GetField(6) + "\nGeschimpft: " + tmp.GetField(7) + "\nCounter: " + tmp.GetField(8)
                              + "\nAggressiv: " + tmp.GetField(9) + "\nCounter: " + tmp.GetField(10) + "\nAntwort: " + tmp.GetField(12) + "\nMessageTime: " + MessageTime );
                }
                return false;
            }
        }
    }

}