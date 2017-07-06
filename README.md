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
