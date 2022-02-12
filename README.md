# twitch-overlays

This Repository shall contain Stream Overlays for Twitch Chat and
Follower/Subscriber/Bit alerts.

It is currently work in progress

## The Goal

A chat and alert box overlay for OBS and other Streaming software that has Browser Layer support.

*Why not use existing ones?*
The ones I found at the time I started this project were either Commercial (they collect data about youre channel) or not capable of the features I wanted.

This Project aims to be capable of running without a Server.
Ofcourse the final build could be hosted (and probably will be on github.io) but all functionality will
be running on the client. The Server will never recive any information except the initial request.
This project is a Single-Page-App using the React framework.
It uses Twitchs OAuth implicit Code flow for Authentication.

## State

currently there is no built version available.
The chat overlay is functional and has the design I created for the original non React version.
This design requires the OpticalA font from Brøderbund.

But the ./src/css/index.css and ./src/css/Chat.css can be edited to create any design you desire.

To use the overlay currently requires yarn or npm.
I use yarn.

I do not recommend running the overlay in development mode as it is not optimized.