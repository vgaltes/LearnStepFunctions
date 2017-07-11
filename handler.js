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
