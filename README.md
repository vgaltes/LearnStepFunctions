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
