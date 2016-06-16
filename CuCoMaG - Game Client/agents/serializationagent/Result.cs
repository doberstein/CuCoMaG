using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;

namespace SerializationAgent
{
    [XmlRoot("Result")]
    public class Result
    {
        [XmlAttribute("PlayerName")]
        public string PlayerName
        {
            get;
            set;
        }
        [XmlAttribute("ResultQuality")]
        public int ResultQuality
        {
            get;
            set;
        }
        [XmlAttribute("AnswerAmount")]
        public int AnswerAmount
        {
            get;
            set;
        }
        [XmlAttribute("OverallTime")]
        public long OverallTime
        {
            get;
            set;
        }
    }
}
