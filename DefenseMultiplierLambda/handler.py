import json
import random

def defenseMultiplier(event, context):
    defenseStrength = event['Defense']['Strength']
    multiplier = random.randint(0,2)
    event['Defense']['Strength'] = multiplier * defenseStrength

    return json.dumps(event)