# Game
- Actor (base class)
    - Properties:
        - BackingDiv -- which is the html `div` element that is respective of this actor
        - Location (float x, float y) tuple
        - DisplayImgSrc
        - bHasEnabledCollision
        - bIsVisible
    - Abstract methods:
        - Tick
        - OnTouch(Actor other)
        - UpdateBackingProps

- Controller
    - Inherits from Actor
- PlayerController
    - Inherits from Controller