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
