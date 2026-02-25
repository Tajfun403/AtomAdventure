# Tables
- Table: Players
    - GUID
    - Name: string
    - Prestige: int
- Table: Items
    - ID: int autoincrement
    - PrettyName: string
    - Image: string
    - Description: string
    - Value
- PlayersItems

# Endpoints
- GET /player/
    - Get currently logged-in player (via cookie)
- GET /items/
    - Get all items
- GET /items/random
    - Get a random item
- GET /inventory/
    - Get all inventory items belonging to the logged-in player (via a cookie)
- DELETE /inventory/:id
    - Delete given instanced item (it is bound to a player automatically)
- Post /player/
    - Create a new player
- PATCH /player/
    - Change player's props
- POST /inventory
    - Send a new item to this player's inventory