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
{ executionArn: 'arn:aws:states:us-east-1:165940758985:execution:RpgStepFunctionsStat
eMachine-U1C4PYE3BAP3:e1aec046-0340-4037-8f52-74ae27fe97ca',
  stateMachineArn: 'arn:aws:states:us-east-1:165940758985:stateMachine:RpgStepFunctio
nsStateMachine-U1C4PYE3BAP3',
  name: 'e1aec046-0340-4037-8f52-74ae27fe97ca',
  status: 'SUCCEEDED',
  startDate: Sun Jul 02 2017 21:19:11 GMT+0100 (BST),
  stopDate: Sun Jul 02 2017 21:19:11 GMT+0100 (BST),
  input: '"hello"',
  output: '"hello"' }
```
