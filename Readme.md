# Atom Adventure
Atom Adventure is a simple 2d shooter game that mimics Space Asteroids, but with extra features -- you can pick up items and sell them for prestige!

## Persistent
Death is not an issue -- your score is saved across sessions.

## With pickups
Pickup items as you play and sell them later on for more Prestige points.

## And animations
The movement is fluid, while the asteroids' destruction is animated as they scatter to space dust.

# How to run

To build the frontend:
```batch
npx tsc -p tsconfig.client.json --watch
```

To run the backend:
```batch
ts-node Server.ts
```

Runs on port 3000. Also contains build profiles for VS Code.