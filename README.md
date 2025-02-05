# Puzzlemon

A discord bot that allows you to create riddles,
that other Users on the Server may try to solve.

## Installation

It is advised to use podman in order to run the database and the application in seperate containers.
The steps to start the bot are following:

1. copy `.env.example` (renamed to `.env`)
2. create a discord bot in the discord developer portal
3. copy the token and application-id from your discord-bot to the `.env`
    file (in the respective environment variable)
4. start the bot with `./deploy.sh`

Alternatively to step 4 you can enable auto-start for linux systems that use systemd.

1. copy `.env.example` (renamed to `.env`)
2. create a discord bot in the discord developer portal
3. copy the token and application-id from your discord-bot to the `.env`
    file (in the respective environment variable)
4. use the initialization script `./quadlet.sh`
5. generate the new services by `sudo systemctl daemon-reload`
6. enable auto-start for the bot with `sudo systemctl start puzzlemon`
