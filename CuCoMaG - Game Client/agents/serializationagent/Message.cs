using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;
namespace SerializationAgent
{
    [XmlRoot("Message")]
    public class Message
    {
        [XmlAttribute("MessageID")]
        public int MessageID
        {
            get;
            set;
        }
        [XmlAttribute("PlayerName")]
        public string PlayerName
        {
            get;
            set;
        }
        [XmlAttribute("SentenceOpener")]
        public string SentenceOpener
        {
            get;
            set;
        }
        [XmlAttribute("PlayerInput")]
        public string PlayerInput
        {
            get;
            set;
        }

        [XmlAttribute("BotResponse")]
        public string BotResponse
        {
            get;
            set;
        }
        [XmlAttribute("Aggression")]
        public bool Aggression
        {
            get;
            set;
        }
        [XmlAttribute("Politeness")]
        public bool Politeness
        {
            get;
            set;
        }
        [XmlAttribute("Rudeness")]
        public bool Rudeness
        {
            get;
            set;
        }
        [XmlAttribute("NoGoSentence")]
        public bool NoGoSentence
        {
            get;
            set;
        }
        [XmlAttribute("MessageTime")]
        public long MessageTime
        {
            get;
            set;
        }
        [XmlAttribute("BotDelay")]
        public int BotDelay
        {
            get;
            set;
        }
        [XmlAttribute("Answerquality")]
        public int Answerquality
        {
            get;
            set;
        }
        [XmlAttribute("SilenceTrigger")]
        public bool SilenceTrigger
        {
            get;
            set;
        }
        [XmlAttribute("ScoreOverall")]
        public int ScoreOverall
        {
            get;
            set;
        }

    }
}
