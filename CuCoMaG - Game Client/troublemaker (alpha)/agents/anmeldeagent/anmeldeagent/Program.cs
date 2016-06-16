using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace AnmeldeAgent
{
    class Program
    {
        static AnmeldungsHandler anmeldungsHandler;

        static void Main(string[] args)
        {
            anmeldungsHandler = new AnmeldungsHandler();
        }
    }
}
