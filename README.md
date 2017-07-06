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

Well done!
