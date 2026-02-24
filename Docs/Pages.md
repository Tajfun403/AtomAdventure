# Website itself
The different scenarios the website will experience, and the way those screens will be handled.

## Entry
- The current player will be stored in a cookie
- If a player cookie doesn't exist yet, the user will be redirected to a registration page

## Registration
- Asks for player name only, displays the game logo up above.
- Allow for duplicate player names.
- A single "Proceed..." button
- Send a new user POST to server when clicked

## Main screen
Shown only if the user is logged in.

Show the username -- has an "edit" mark next to it, clicking it will enter edit mode.

Then, buttons:
- Manage profile & inventory
- Enter battle!

## Profile & Inventory managment
Lets the user:
- Edit their profile (so currently only their username lol)
- View their items
- Delete them
- Sell them

Probably needs a shop so that they can spend their currency...?
Or no! Call it their PRESTIGE RATING. Done, no shop needed.

Once the player kills enough entities, it will ask the server to serve it more.

## After death...
Display some nice notification. Then, come back to the main screen.