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

Create a simple Step Function called *rpg* with an state called *Attack* of type Pass.

Deploy the Step Function and test it.

Check the Step Function in the AWS console.

![step 1](/images/1.png)

Check the [Step 1 branch](https://github.com/vgaltes/learnstepfunctions/tree/Step1) to see the final solution.

## A parallel execution

Create a parallel state called *CalculateMultipliers* with two branches. The first branch should have a state of type Pass called *AttackMultiplier* and the second branch should have a state of type Pass called *DefenseMultiplier*. 

Create the step that collects the result of the paralles execution and name it *Result*.

Link the state created in the previous step to the parallel one.

Deploy and test the Step Function.

Check the Step Function in the AWS console.

![step 2](/images/2.png)

Check the [Step 2 branch](https://github.com/vgaltes/learnstepfunctions/tree/Step2) to see the solution.

## Choices

Rename the *Result* state to *CalculateAttackResult*. Change its type to Choice and create two choices, one for a number greater than 0 and the other for a number less or equal to 0 (use any variable you want depending on what you want to pass to the function). 

Link the first choice to an state of type Fail named *Alive* and link the second choice to an state of type Succeed named *Dead*.

Deploy and test the function.

Check the Step Function in the AWS console.

![step 3](/images/3.png)

Check the [Step 3 branch](https://github.com/vgaltes/learnstepfunctions/tree/Step3) for the final solution.

## Our first lambda

Create a Lambda using C#, call it *AttackMultiplierLambda*. The lambda will receive a JSON like this:

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
      "Strength": 30
    }
  }

Create the classes that will allow us to receive this input (and return it).

Change the code to generate a number between 0 and 2 (0, 1 or 2) and multiply the strength of the attack to it. Return the whole object.

Deploy the function and test it.

Check the [Step 4 branch](https://github.com/vgaltes/learnstepfunctions/tree/Step4) for the final solution.

## Defense multiplier in Python

Create a Lambda using Python.

Change the code to generate a number between 0 and 2 (0, 1 or 2) and multiply the strength of the defense to it. Return the whole object.

Deploy the function and test it.

Check the [Step 5 branch](https://github.com/vgaltes/learnstepfunctions/tree/Step5) for the final solution.

## Calculate result in JS

Create a Lambda using NodeJS.

Change the code to calculate the result of the attack, i.e. substract the result of the substraction of the strength of the defense to the strength of the attack, to the player's live.

Return the result (the whole object).

Deploy and test the Lambda.

Check the [Step 6 branch](https://github.com/vgaltes/learnstepfunctions/tree/Step6) for the final solution.

## Joining all together

Modify the serverles.yml file in the root folder to replace the actual states of *CalculateAttackMultiplier*, *CalculateDefenseMultiplier* and *CalculateResult* with the recently created Lambdas.

Deploy the Step Function and test it.

Check the [Step 7 branch](https://github.com/vgaltes/learnstepfunctions/tree/Step7) for the final solution.
