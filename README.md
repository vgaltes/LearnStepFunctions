## Our first lambda

Now that we have the skeleton of the Step Function, let's develop our first lambda. Let's start with some .Net Core and C#. In your root folder type `serverless create --template aws-csharp --path AttackMultiplierLambda`. Open the csproj file and delete these two lines
```
<AssemblyName>CsharpHandlers</AssemblyName>
<PackageId>aws-csharp</PackageId>
```

Add the following nuget packages:
```
Amazon.Lambda.Core
Amazon.Lambda.Serialization.Json
```

And change the name of the csproj file to `AttackMultiplierLambda.csproj`. Rename the `Handler.cs` file to `AttackMultiplierLambda.cs`.

Replace the content of the file with the following code:

```
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
```
As you can see, we are defining the class that we're going to accept and return from the Lambda. Inside the lambda, we're just creating a random number between 0 and 2, and multiplying the attack strength by this number.

To restore packages, build the project and create a package, just run `build.sh` or `build.cmd`.

It's time to define the `serverless.yml` file of the lambda so that we can deploy and test it. Replace the contents of the file with the following contents:

```
service: AttackMultiplierLambda

provider:
  name: aws
  runtime: dotnetcore1.0
  profile: <your profile name>
  region: us-east-1
  stage: dev

package:
  artifact: bin/release/netcoreapp1.0/deploy-package.zip

functions:
  AttackMultiplier:
    handler: AttackMultiplierLambda::RPG.AttackMultiplierLambda::AttackMultiplier
```

It's quite a simple file. We're defining our provider as usual, telling serverless where is the package we want to deploy and we're defining the function giving it a name (AttackMultiplier) and telling AWS where it can be found (dll::namespace.class::method)

It's time to deploy: `sls deploy`.

To test the Lambda we should pass a json that can be deserialized to the classes we've defined in the Lambda. 

`sls invoke -f AttackMultiplier --data '{"Attack":{"Player":{"Level":10, "Live":50}, "Strength":10}, "Defense":{"Player":{"Level":8, "Live":20}, "Strength": 30}}'`

You should get something like this as a response:
```
{
    "Attack": {
        "Player": {
            "Level": 10,
            "Live": 50
        },
        "Strength": 0
    },
    "Defense": {
        "Player": {
            "Level": 8,
            "Live": 20
        },
        "Strength": 30
    }
}
```

In this case the multiplier was 0 :-)
