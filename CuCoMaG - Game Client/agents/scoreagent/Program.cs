using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ScoreAgent
{
    class Program
    {
        static void Main(string[] args)
        {
            // hier sollen die nötigen tupel geladen werden
            // Die eigenschaften die für eine bewertung des Dialogs notwendig sind müssen herausgefiltert werden
            // Der agent addiert alle dialogbewertungen einer Phase und speichert diese seperat 
            //ausserdem errechnet er eine gesamtscore nach beendigung aller phasen
            new ScoreAnalyse();
        }
    }
}
