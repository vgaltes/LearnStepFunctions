'use strict';

module.exports.calculateAttackResult = (event, context, callback) => {
  let attackResult = event[0];
  let defenseResult = event[1];

  let attack = attackResult.Attack.Strength - defenseResult.Defense.Strength;

  if ( attack < 0 ) attack = 0;

  defenseResult.Defense.Player.Live = defenseResult.Defense.Player.Live - attack;

  let result = {"Attack": attackResult.Attack, "Defense" : defenseResult.Defense};

  callback(null, result);
};
