# Learn Step Functions

This is a workshop to learn how to develop and deploy [AWS Step Functions] (https://aws.amazon.com/documentation/step-functions/). You can find some tutorials I've written [here](http://vgaltes.com/tags/#serverless).

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

Download and install the latest version of Python from the [official website](https://www.python.org/downloads/)

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
