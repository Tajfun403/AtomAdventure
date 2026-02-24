# Tables
- Table: Players
    - GUID
    - Prestige: int
- Table: Items
    - ID: int autoincrement
    - PrettyName: string
    - Image: string
    - Description: string
    - Value
- PlayersItems

# Endpoints
- GET /players/:guid
    - Get player with this guid
- GET /items/
    - Get all items
- GET /items/random
    - Get a random item
- GET /inventory/:playerGUID
    - Get all inventory items belonging to given player GUID
- DELETE /inventory/:id
    - Delete given instanced item (it is bound to a player automatically)
- Post /player/
    - Create a new player
- PATCH /player/
    - Change player's props
- POST /inventory
    - Send a new item to this player's inventory