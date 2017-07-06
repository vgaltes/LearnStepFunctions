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
