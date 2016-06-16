using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Timers;
using Collide.SQLSpaces;

namespace SilenceAgent
{
    class Program
    {
        static SilenceAnalyse analyse;
        
        static void Main(string[] args)
        {
            analyse = new SilenceAnalyse();
        }

    }
}
