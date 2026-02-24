# Game classes
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
- AIController
    - A simple AI controller that will snapshot player's location on spawn and continously lead the Actor that specfied location.

# Views
- Game
    - Page for the basic game
- Manage
    - Manager player's profile and inventory
- Register
    - Give yourself a new name when entering the game for the first time

# Integration
- I consider making a banner with the basic player data (their name and currency), but due to time constraints, I think injecting that banner isn't really necessary. Dynamic page building isn't in the requirements, after all!
- Instead, each mode will have its own, simple html page
    - That will make managment easier
    - I will need a loading screen
        - So... maybe I should still inject the loading screen via a template
        - I can also just fade to black and out of black
        - I can just make it the background!
            - And then change opacity of the actual content as neccessary
            - Should look relatively fluid