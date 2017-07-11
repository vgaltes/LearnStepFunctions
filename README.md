# Learn Step Functions

This is a workshop to learn how to develop and deploy [AWS Step Functions] (https://aws.amazon.com/documentation/step-functions/). You can find some tutorials I've written [here](http://vgaltes.com/tags/#serverless).

## Pre-requisites

## Serverless framework

We're going to use the [serverless framework](http://serverless.com) to deploy and test the step functions. The serverless framework is a NodeJS library, so first we'll need to install NodeJs. Go to the [NodeJS] website and install it in your favourite OS.

Once we have NodeJS install, we can install the serverless framework. To do that, open a terminal window and type `npm install serverless -g`. That will install the framework. To check that the installation finished successfully, type `sls -v` to see the installed version of the framework. At the time of writting, you should see `1.16.1`

## .Net Core

You can download the last version of the SDK, but we'll need to target netcoreapp1.0. So, go to the [official website](https://www.microsoft.com/net/core) and follow the instructions for your favourite OS.

## Javascript

If you've followed the steps to install the serverless framework, you should be in a good position to develop using Javascript.

## Python

Download and install the latest version of Python from the [official website](https://www.python.org/downloads/)

## VSCode

I'm going to use VSCode in this workshop (you can use whatever editor you'd like). If you don't have VSCode installed, go to the [official website](https://code.visualstudio.com/) and follow the instructions for you favourite OS.

There are a couple of extensions that will make our live easier. For F# development, download the [ionide](http://ionide.io/) extension. For C# development, download the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp).

## AWS

You'll need an AWS account to follow the workshop. You can get one for free [here](https://aws.amazon.com/free/). Once you have the account, you'll need to setup an account so that the serverless framework can interact with AWS. Please, follow the steps explained [here](https://serverless.com/framework/docs/providers/aws/guide/credentials/). My preferred option is to set up an AWS profile. 


## Calling the Step Function.

We have two ways of calling the Step Function.

### Creating an HTTP endpoint

Add this code to your serverless.yml file, in the definition of the Step Function

```
events:
  - http:
      path: attack
      method: POST
```

Deploy the Step Function `sls deploy`. You should see something like this at the end of the deployment log:

```
Serverless StepFunctions OutPuts
endpoints:
  POST - https://74581sqavc.execute-api.us-east-1.amazonaws.com/dev/attack
```

Call this endpoint using curl or postman.

```
curl -XPOST https://74581sqavc.execute-api.us-east-1.amazonaws.com/dev/attack -d '{"Attack":{"Player":{"Level":10, "Live":50}, "Strength":10}, "Defense":{"Player":{"Level":8, "Live":20}, "Strength": 30}}'
```

### Calling it from another Lambda

Add the aws-sdk package from the root folder:

*npm install --dev aws-sdk* or *yarn add --dev aws-skd*

Name your Step Function:

```
(...)
stepFunctions:
  stateMachines:
    rpg:
      name: Rpg
      definition:
        StartAt: Attack
(...)
```

Edit the serverless.yml file to add just befor the plugins sections this code to export the arn of the Step Function.

```
(...)
resources:
  Outputs:
    Rpg:
      Description: The ARN of the state machine
      Value:
        Ref: Rpg
(...)

Create a handler.js file with the following code:

```
'use strict';

const AWS = require('aws-sdk');

module.exports.performAttack = (event, context, callback) => {
  var params = {
    stateMachineArn: process.env.rpg_arn,
    input: event
  };

  var stepfunctions = new AWS.StepFunctions();

  stepfunctions.startExecution(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Attack in progress...',
      input: event,
    }),
  };

  callback(null, response);
};
```

Define the function in the serverless.yml file. Pass the arn of the Step Function as an environment variable.

```
(...)
functions:
  performAttack:
    handler: handler.performAttack
    events:
        - http:
            path: performAttack
            method: POST
    environment:
      rpg_arn: ${self:resources.Outputs.Rpg.Value}
(...)
```

Extend the providers section to grant permissions to the role to be able to execute the Step Function

```
(...)
provider:
  name: aws
  runtime: nodejs6.10
  profile: serverless-admin-vgaltes
  region: us-east-1
  stage: dev
  iamRoleStatements:
    -  Effect: "Allow"
       Action:
         - "states:StartExecution"
       Resource: ${self:resources.Outputs.Rpg.Value}
(...)
```

Deploy the service: `sls deploy`

Call the recently created function using curl or postman:

```
curl -XPOST https://74581sqavc.execute-api.us-east-1.amazonaws.com/dev/performAttack -d '{"Attack":{"Player":{"Level":10, "Live":50}, "Strength":10}, "Defense":{"Player":{"Level":8, "Live":20}, "Strength": 30}}'
```