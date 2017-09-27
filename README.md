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
