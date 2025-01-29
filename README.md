# Puzzlemon

A discord bot that allows you to create riddles,
that other Users on the Server may try to solve.

## Installation

The best way to run this is by using the tools

- docker
- docker-compose
- make

1. copy `.env.example` (renamed to `.env`)
2. create a discord bot in the discord developer portal
3. copy the token and application-id from your discord-bot to the `.env`
    file (in the respective environment variable)
4. start the bot with `make prod` or `make prod-detached`
