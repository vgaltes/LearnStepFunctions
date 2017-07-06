'use strict';

module.exports.calculateAttackResult = (event, context, callback) => {
  let attackResult = event[0];
  let defenseResult = event[1];

  defenseResult.Defense.Player.Live = defenseResult.Defense.Player.Live - attackResult.Attack.Strength;

  let result = {"Attack": attackResult.Attack, "Defense" : defenseResult.Defense};

  callback(null, JSON.stringify(result));
};
