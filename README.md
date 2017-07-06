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
