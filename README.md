# airhornbot

A Node.js implementation of Airhorn Bot.

# Setup

Prerequisites:
- Redis Server
- Yarn

## Website

Build the website for usage.

Example commands:
```
cd website
yarn install
yarn run build
```

## Bot

Build the bot and webserver process.

Make sure to update/create `config.json`!

Example commands:
```
cd bot
yarn install
yarn run build
```

To register the slash commands:
```
cd bot
yarn run register-commands
```

To run the bot:
```
cd bot
yarn run bot
```

To run the web server:
```
cd bot
yarn run web
```

## How to add sounds

Adding new sounds requires two steps:
1. Add an opus sound file to the appropriate folder in `bot/sounds`
2. Update `config.json` with the link to the audio file under "variants"

The structure is:

"sounds": {
  folder name where the audio is (eg, "aussie"): {
    "variants": {
      sounds command (eg, Quack): audio file (eg, duck_quack.opus)
    }
  }
}

Here's an example commit where we added a new category and audio: https://github.com/BSierakowski/airhornbot/commit/dc764b19bbdc42e29b21da1a87f7deb62641059b


## Installing the Bot
Use the following auth URL to install the bot:
https://discord.com/api/oauth2/authorize?client_id=1036007046757220443&permissions=36703232&scope=applications.commands%20bot
