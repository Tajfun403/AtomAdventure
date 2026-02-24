# Original requirements
1. FRONT
    - Strony HTML + CSS
    - JavaScript do komunikacji z backendem (fetch API lub XMLHttpRequest)
    - Min 3 widoki/strony/podstrony (w tym mogą byc popupy)
    - Formularz do wpisywania, edytowanie danych
    - Wyświetlanie danych z bazy list/rekordu
    - Responsywny i czytelny design
2. BACKEND
    - Aplikacja serwerowa w Node.js z Express.js
    - API RESTful z minimum 4 endpointami (GET, POST, PUT/PATCH, DELETE)
    - Połączenie z bazą danych (np. PostgreSQL, MySQL, SQLLITe, MongoDB)
    - Co najmniej 2 tabele/kolekcje z relacją między nimi
    - Walidacja danych wejściowych
    - Obsługa błędów (try-catch, middleware do błędów)
3. DODATKOWE
    - Struktura projektu z podziałem na foldery (routes, models, public, views)
    - Plik package.json z zależnościami
    - Plik .env dla konfiguracji (dane do bazy)
    - README.md z instrukcją uruchomienia

# Requirements but in English
There are some design constraints that are necessied by the assigment requirements:
- Need a backend database 
    - With at least two tables,
    - And a relation between them
- 4 RESTful endpoints:
    - GET
    - POST
    - PUT/PATCH
    - DELETE
- At least Views
- Displaying data from a database
    - Include entering and editing data
- Be responsive

## My limitations
I will certainly *not* implement some features:
- User auth
- Replication (so no multiplayer or server-side gameplay)

## Filling those requirements

### Profiles / Auth
- There is no requirement of user login or authentication, thanks to which I can skip this part entirely.
- Because of no user authentication, long-term storage will be feasingly impossible
    - I can generate a per-user cookie tied to the browser. Not perfect, but would allow me to hold persistent state while not requiring any accounts.
    - Not like I would want accounts in a simple open-and-play game like that.

### HTML endpoint types
- GET
    - GET a random Item, so that it can be spawned
    - GET a player's inventory
- POST
    - POST a new acquired item to the player's inventory
- PATCH
    - Sell items -- increase player's money
- DELETE
    - Discard an item

### DB
Tables:
- Items
    - Pickupable items
- Inventory
    - Inventory for the player
    - Contains Items