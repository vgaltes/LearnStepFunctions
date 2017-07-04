using Amazon.Lambda.Core;
using System;

[assembly:LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace RPG
{
    public class AttackMultiplierLambda
    {
       public Turn AttackMultiplier(Turn turn)
       {
           var randomNumberGenerator = new System.Random();
           var multiplier = randomNumberGenerator.Next(0,2);

           turn.Attack.Strength = multiplier * turn.Attack.Strength;

           return turn;
       }
    }

    public class Player{
      public int Level {get;set;}
      public int Live{get;set;}
    }

    public class Action{
      public Player Player{get;set;}
      public int Strength{get;set;}
    }

    public class Turn
    {
      public Action Attack{get;set;}

      public Action Defense{get;set;}
    }
}
