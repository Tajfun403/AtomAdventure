# Tables
- Table: Players
    - GUID
    - Prestige
- Table: Items
    - ID
    - PrettyName
    - Image
    - Description
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
- PATCH /player/money/:count
    - Change player's money
- POST /inventory
    - Send a new item to this player's inventory