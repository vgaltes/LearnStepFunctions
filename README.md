# Learn Step Functions

This is a workshop to learn how to develop and deploy [AWS Step Functions](https://aws.amazon.com/documentation/step-functions/). You can find some tutorials I've written [here](http://vgaltes.com/tags/#serverless).

## Pre-requisites

### Serverless framework

We're going to use the [serverless framework](http://serverless.com) to deploy and test the step functions. The serverless framework is a NodeJS library, so first we'll need to install NodeJs. Go to the [NodeJS] website and install it in your favourite OS.

Once we have NodeJS install, we can install the serverless framework. To do that, open a terminal window and type `npm install serverless -g`. That will install the framework. To check that the installation finished successfully, type `sls -v` to see the installed version of the framework. At the time of writting, you should see `1.16.1`

You'll need to install the [plugin](https://github.com/horike37/serverless-step-functions) for step functions. To do that, create your working folder and, inside it type `npm install --save serverless-step-functions`

### .Net Core

You can download the last version of the SDK, but we'll need to target netcoreapp1.0. So, go to the [official website](https://www.microsoft.com/net/core) and follow the instructions for your favourite OS.

### Javascript

If you've followed the steps to install the serverless framework, you should be in a good position to develop using Javascript.

### Python

Download and install the latest version of Python from the [official website](https://www.python.org/downloads/release/python-361). Take a look [here](https://www.digitalocean.com/community/tutorials/how-to-install-python-3-and-set-up-a-local-programming-environment-on-macos) for extra help.

### VSCode

I'm going to use VSCode in this workshop (you can use whatever editor you'd like). If you don't have VSCode installed, go to the [official website](https://code.visualstudio.com/) and follow the instructions for you favourite OS.

There are a couple of extensions that will make our live easier. For F# development, download the [ionide](http://ionide.io/) extension. For C# development, download the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp).

### AWS

You'll need an AWS account to follow the workshop. You can get one for free [here](https://aws.amazon.com/free/). Once you have the account, you'll need to setup an account so that the serverless framework can interact with AWS. Please, follow the steps explained [here](https://serverless.com/framework/docs/providers/aws/guide/credentials/). My preferred option is to set up an AWS profile. It's a good idea that you give access from the console to that user, so you can connect to it and see the step function running.

## Creating the first function

Go to your root folder and create a file named serverless.yml. In this file, we'll define the step function. When we call the deploy command of the serverless framework, it looks for a file with this name and deploys all what we've defined there. So, edit the file and copy the following contents:
```
service: LearnStepFunctions

provider:
  name: aws
  runtime: dotnetcore1.0
  profile: <your profile name>
  region: us-east-1
  stage: dev

stepFunctions:
  stateMachines:
    rpg:
      definition:
        StartAt: Attack
        States:
          Attack:
            Type: Pass
            End: true

plugins:
  - serverless-step-functions
```
We're creating here a very simple step function with just one state. The state is a Pass state, a state that just forwards what receives as an input to the output. Run the following command to deploy the step function `sls deploy`. And run the following command to test it `sls invoke stepf --name rpg --data '"hello"'`. You should see something like this as a result

```
{ executionArn: 'arn:aws:states:us-east-1:165940758985:execution:RpgStepFunctionsStateMachine-U1C4PYE3BAP3:e1aec046-0340-4037-8f52-74ae27fe97ca',
  stateMachineArn: 'arn:aws:states:us-east-1:165940758985:stateMachine:RpgStepFunctionsStateMachine-U1C4PYE3BAP3',
  name: 'e1aec046-0340-4037-8f52-74ae27fe97ca',
  status: 'SUCCEEDED',
  startDate: Sun Jul 02 2017 21:19:11 GMT+0100 (BST),
  stopDate: Sun Jul 02 2017 21:19:11 GMT+0100 (BST),
  input: '"hello"',
  output: '"hello"' }
```
Login into the AWS console with the service credentials, to to the Step Function service and click on the Step Function and the execution. You should see something like this:

![step 1](/images/1.png)

Check the Step 1 branch to see the final solution.

## A parallel execution

Let's create a parallel state now. Edit the serverless.yml file and copy the following content:
```
service: LearnStepFunctions

provider:
  name: aws
  runtime: dotnetcore1.0
  profile: <your profile>
  region: us-east-1
  stage: dev

stepFunctions:
  stateMachines:
    rpg:
      definition:
        StartAt: Attack
        States:
          Attack:
            Type: Pass
            Next: CalculateMultipliers
          CalculateMultipliers:
            Type: Parallel
            Branches:
            - StartAt: AttackMultiplier
              States:
                AttackMultiplier:
                  Type: Pass
                  End: true
            - StartAt: DefenseMultiplier
              States:
                DefenseMultiplier:
                  Type: Pass
                  End: true
            Next: Result
          Result:
            Type: Pass
            End: true

plugins:
  - serverless-step-functions
```

Deploy the step function using `sls deploy` and test it using `sls invoke stepf --name rpg --data '"hello"'`. You should see something like this as the result:
```
{ executionArn: 'arn:aws:states:us-east-1:165940758985:execution:RpgStepFunctionsStateMachine-WPVJFEDAA90Q:7dd144f6-2680-49b9-a3a2-2c921c56e618',
  stateMachineArn: 'arn:aws:states:us-east-1:165940758985:stateMachine:RpgStepFunctionsStateMachine-WPVJFEDAA90Q',
  name: '7dd144f6-2680-49b9-a3a2-2c921c56e618',
  status: 'SUCCEEDED',
  startDate: Sun Jul 02 2017 22:48:07 GMT+0100 (BST),
  stopDate: Sun Jul 02 2017 22:48:07 GMT+0100 (BST),
  input: '"hello"',
  output: '["hello","hello"]' }
```

As you can see, each parallel execution result is passed to the next step as a item in an array. Results always come in order: the first defined parallel state result will be the first item in the array, and so on.

If you connect to the console and take a look at the execution you should see something like this:

![step 2](/images/2.png)

Check the Step 2 branch to see the solution.

## Choices

We're going to add some choices now. Edit the serverless.yml file and paste there the following content

```
service: LearnStepFunctions

provider:
  name: aws
  runtime: dotnetcore1.0
  profile: serverless-admin-vgaltes
  region: us-east-1
  stage: dev

stepFunctions:
  stateMachines:
    rpg:
      definition:
        StartAt: Attack
        States:
          Attack:
            Type: Pass
            Next: CalculateMultipliers
          CalculateMultipliers:
            Type: Parallel
            Branches:
            - StartAt: AttackMultiplier
              States:
                AttackMultiplier:
                  Type: Pass
                  End: true
            - StartAt: DefenseMultiplier
              States:
                DefenseMultiplier:
                  Type: Pass
                  End: true
            Next: CalculateAttackResult
          CalculateAttackResult:
            Type: Pass
            InputPath: $[0]
            Next: IsEnemyAlive
          IsEnemyAlive:
            Type: Choice
            Choices:
              - Variable: $.value
                NumericGreaterThan: 0
                Next: Alive
              - Variable: $.value
                NumericLessThanEquals: 0
                Next: Dead
          Alive:
            Type: Fail
            Cause: "You haven't killed the enemy"
          Dead:
            Type: Succeed

plugins:
  - serverless-step-functions
```

As you can see, we've added a new state of type choice. The state has two choices and the decision point if the value of the `value` field of the input. As a parallel state returns an array of objects, we just take the first one to make the decision. If the value is a positive number, we end the execution with an state of type Fail. If the value is a negative number or zero, we end the execution with an state of type Succeed.

Let's deploy this State Function using `sls deploy` and test it using `sls invoke stepf --name rpg --data '{"value": 10}'`. In this case we're passing a positive number, so we expect the function to fail.
 
 ```
 { executionArn: 'arn:aws:states:us-east-1:165940758985:execution:RpgStepFunctionsStateMachine-RTXKGTTK7GLA:f666de01-28f6-4661-bf46-56c1ba1a732d',
  stateMachineArn: 'arn:aws:states:us-east-1:165940758985:stateMachine:RpgStepFunctionsStateMachine-RTXKGTTK7GLA',
  name: 'f666de01-28f6-4661-bf46-56c1ba1a732d',
  status: 'FAILED',
  startDate: Mon Jul 03 2017 10:23:58 GMT+0100 (BST),
  stopDate: Mon Jul 03 2017 10:23:59 GMT+0100 (BST),
  input: '{"value": 10}',
  cause: 'You haven\'t killed the enemy' }
 ```

But if we test the function using a negative number `sls invoke stepf --name rpg --data '{"value":-10}'` the result will be a success.
```
{ executionArn: 'arn:aws:states:us-east-1:165940758985:execution:RpgStepFunctionsStateMachine-RTXKGTTK7GLA:e6599e69-abd2-4526-b219-03e809a4bee3',
  stateMachineArn: 'arn:aws:states:us-east-1:165940758985:stateMachine:RpgStepFunctionsStateMachine-RTXKGTTK7GLA',
  name: 'e6599e69-abd2-4526-b219-03e809a4bee3',
  status: 'SUCCEEDED',
  startDate: Mon Jul 03 2017 10:24:07 GMT+0100 (BST),
  stopDate: Mon Jul 03 2017 10:24:07 GMT+0100 (BST),
  input: '{"value": -10}',
  output: '{"value":-10}' }
```

If you connect to the console you should see something like:

![step 3](/images/3.png)

Check the Step 3 branch for the final solution.

## Our first lambda

Now that we have the skeleton of the Step Function, let's develop our first lambda. Let's start with some .Net Core and C#. In your root folder type `serverless create --template aws-chsarp --path AttackMultiplierLambda`. Open the csproj file and delete these two lines
```
<AssemblyName>CsharpHandlers</AssemblyName>
<PackageId>aws-csharp</PackageId>
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

Check the Step 4 branch for the final solution.

## Defense multiplier in Python
Let's code another Lambda, in this case in Python. In the root folder type `serverless create --template aws-python3 --path DefenseMultiplierLambda`. Go to the handler.py file and replace its content with the following code: 

```
import random

def defenseMultiplier(event, context):
    defenseStrength = event['Defense']['Strength']
    multiplier = random.randint(0,2)
    event['Defense']['Strength'] = multiplier * defenseStrength

    return event
```

Now edit the serverless.yml file and replace its content with the following code:

```
service: DefenseMultiplierLambda

provider:
  name: aws
  runtime: python3.6
  profile: <your profile name>
  region: us-east-1
  stage: dev

functions:
  DefenseMultiplier:
    handler: handler.defenseMultiplier
```
Same idea than the previous Lambda. We specify that we have a function called DefenseMultiplier and that the entry point of the lambda is on the method defenseMultiplier of the file handler.

Time to deploy: `sls deploy`

And test: `sls invoke -f DefenseMultiplier --data '{"Attack":{"Player":{"Level":10, "Live":50}, "Strength":10}, "Defense":{"Player":{"Level":8, "Live":20}, "Strength": 30}}'`

You should see something like this as the response:

```
{
  "Attack":{
    "Player":{
      "Level":10,
      "Live":50
    },
    "Strength":10
  },
  "Defense":{
    "Player":{
      "Level":8,
      "Live":20
    },
    "Strength":60
  }
}
```

In this case the multiplier was 2 :-)

Check the Step5 branch for the final solution.

## Calculate result in JS

Let's code another Lambda, in this case in JS. In the root folder type `serverless create --template aws-nodejs --path CalculateAttackResultLambda`. Go to the handler.js file and replace its content with the following code: 

```
'use strict';

module.exports.calculateAttackResult = (event, context, callback) => {
  let attackResult = event[0];
  let defenseResult = event[1];

  defenseResult.Defense.Player.Live = defenseResult.Defense.Player.Live - attackResult.Attack.Strength;

  let result = {"Attack": attackResult.Attack, "Defense" : defenseResult.Defense};

  callback(null, result);
};
```

As you can see, we're calculating the remaining life of the deffender. This is the state that collects the result of the parallel state, so we're receiving the result of each of the parallel tasks in an array. 

Now edit the serverless.yml file and replace its content with the following code:

```
service: CalculateAttackResultLambda

provider:
  name: aws
  runtime: nodejs6.10
  profile: <your profile name>
  region: us-east-1
  stage: dev

functions:
  calculateAttackResult:
    handler: handler.calculateAttackResult

```

Time to deploy: `sls deploy`

And test:
```
sls invoke -f calculateAttackResult --data '[{"Attack":{"Player":{"Level":10, "Live":50}, "Strength":10}, "Defense":{"Player":{"Level":8, "Live":20}, "Strength": 30}}, {"Attack":{"Player":{"Level":10,"Live":50}, "Strength":10}, "Defense":{"Player":{"Level":8, "Live":20}, "Strength": 30}}]'
```

You should see the following result:

```
{
  "Attack":{
    "Player":{
      "Level":10,
      "Live":50
    },
    "Strength":10
  },
  "Defense":{
    "Player":{
      "Level":8,
      "Live":10
    },
    "Strength":30
  }
}
```

Check the Step6 branch for the final solution.

## Joining all together

It's time to use those Lambdas in our step function. So, go to your root folder, edit the serverless.yml file and update it with the following code:

```
service: LearnStepFunctions

custom:
  accountId: <your account id> #find it in the AWS console
  attackMultiplierService: AttackMultiplierLambda
  defenseMultiplierService: DefenseMultiplierLambda
  calculateResultService: CalculateAttackResultLambda

provider:
  name: aws
  runtime: dotnetcore1.0
  profile: <your profile id>
  region: us-east-1
  stage: dev

stepFunctions:
  stateMachines:
    rpg:
      definition:
        StartAt: Attack
        States:
          Attack:
            Type: Pass
            Next: CalculateMultipliers
          CalculateMultipliers:
            Type: Parallel
            Branches:
            - StartAt: AttackMultiplier
              States:
                AttackMultiplier:
                  Type: Task
                  Resource: arn:aws:lambda:${opt:region}:${self:custom.accountId}:function:${self:custom.attackMultiplierService}-${opt:stage}-AttackMultiplier
                  End: true
            - StartAt: DefenseMultiplier
              States:
                DefenseMultiplier:
                  Type: Task
                  Resource: arn:aws:lambda:${opt:region}:${self:custom.accountId}:function:${self:custom.defenseMultiplierService}-${opt:stage}-DefenseMultiplier
                  End: true
            Next: CalculateAttackResult
          CalculateAttackResult:
            Type: Task
            Resource: arn:aws:lambda:${opt:region}:${self:custom.accountId}:function:${self:custom.calculateResultService}-${opt:stage}-calculateAttackResult
            Next: IsEnemyAlive
          IsEnemyAlive:
            Type: Choice
            Choices:
              - Variable: $.Defense.Player.Live
                NumericGreaterThan: 0
                Next: Alive
              - Variable: $.Defense.Player.Live
                NumericLessThanEquals: 0
                Next: Dead
          Alive:
            Type: Fail
            Cause: "You haven't killed the enemy"
          Dead:
            Type: Succeed

plugins:
  - serverless-step-functions
```

Some things to take into account here:
 - We're defining some custom variables that we'll use afterwards
 - We're changing some steps to use a Task. When we do that, we need to specify a Resource, which is what identifies the lambda. That will be the same identifier you will find in the AWS console. We're constructing it using the custom variables and some [CLI options](https://serverless.com/framework/docs/providers/aws/guide/variables/#referencing-cli-options)
 - We're changing the variables in the choice step to use the new output.
 
As always, it's time to deploy: 'sls deploy'

And to test:
```
sls invoke stepf --name rpg --data '{"Attack":{"Player":{"Level":10, "Live":50}, "Strength":10}, "Defense":{"Player":{"Level":8, "Live":20}, "Strength": 30}}'
```

You should see something like this as output:
```
{ executionArn: 'arn:aws:states:us-east-1:165940758985:execution:RpgStepFunctionsStateMachine-KWBQD89RFQOY:7e92d52e-bfb6-4f09-a173-981a9ee7cea9',
  stateMachineArn: 'arn:aws:states:us-east-1:165940758985:stateMachine:RpgStepFunctionsStateMachine-KWBQD89RFQOY',
  name: '7e92d52e-bfb6-4f09-a173-981a9ee7cea9',
  status: 'FAILED',
  startDate: 2017-07-06T19:08:50.042Z,
  stopDate: 2017-07-06T19:08:51.127Z,
  input: '{"Attack":{"Player":{"Level":10, "Live":50}, "Strength":10}, "Defense":{"Player":{"Level":8, "Live":20}, "Strength": 30}}',
  cause: 'You haven\'t killed the enemy' }
```

Well done! You can check the final solution in the Step7 branch
