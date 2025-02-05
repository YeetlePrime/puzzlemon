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
4. start the bot with `./start.sh`

Alternatively to step 4 you can enable auto-start for linux systems that use systemd.

1. copy `.env.example` (renamed to `.env`)
2. create a discord bot in the discord developer portal
3. copy the token and application-id from your discord-bot to the `.env`
    file (in the respective environment variable)
4. use the initialization script `./deploy_systemd.sh`. This makes the service automatically start on next login.
5. instantly start the bot by `systemctl --user daemon-reload && systemctl --user start puzzlemon`
6. if you want the bot to start on boot instead on login, use `loginctl enable-linger <USER>` to make the user linger
