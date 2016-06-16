using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Collide.SQLSpaces;
using System.Threading;

namespace SchimpfAgent
{
    class Program
    {
        static SchimpfAnalyse analyse;
        
        static void Main(string[] args)
        {
            analyse = new SchimpfAnalyse();
        }
    }
}
