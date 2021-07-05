![alt text](https://github.com/mnedelchev-vn/dxsale-sniper-bot/blob/main/dxsale-logo.png)

# DxSale sniper bot

## Purpose
This bot allows you to compete with other trading bots when buying a cryptocurrency which is going to be on presale on DxSale launch platform.

## Features
* Including transaction options like gas price, gas limit, etc
* Multi-address transactions ( by default DxSale presale allows each address to participate once at a particular sale so you can setup multiple addresses to join the presale )
* Supporting milliseconds
* Free

## Requirements
* npm 6.0.0 or above
* NodeJS 10.0.0 or above
* pm2

## Installation
Clone this repository ( or download from Code -> Download ZIP ) and run `npm install` inside the project folder. This command will download all the needed libraries which the bot needs to work properly.

## Usage
You can run the script using `node` or `pm2` commands. I personally like to use the `pm2` command on my server, because PM2 is a process manager which takes care for my script to run 24/7. 

#### Required parameters:
* `dxSalePresaleContractAddress` - this is the DxSale presale contract address **( not the contract address of the token you're willing to buy )**. String, 42 bytes size starting with `0x`.
* `buyingBnbAmount` - this is the amount of BNB which you are willing to use to execute the buying transaction. Integer or float.
* `senderPrivateKey` - this is the private key of the wallet address which will be used to execute the buying transaction. For multi-address transactions then list the private keys separated by `,`, example - `senderPrivateKey=0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f,0x3da3ef21b123d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b42de8E`. Each private key have to have 66 bytes size starting with `0x`.

#### Optional parameters:
* `gasLimit` - the maximum amount of gas you are willing to consume on a transaction, default value is 500000.
* `gasPrice` - the transaction gas price in Gwei, default value is 10 Gwei.
* `createLogs` - boolean, if set to `true` it will create ./logs folder and save logs on different bot actions.
* `cronTime` - how often should the bot try to buy the particular token. Default is `'*/100 * * * * * *'` aka every 100 milliseconds.
* `botInitialDelay` - by default when starting the bot for first time it has 10 seconds delay to double check what parameters have been passed. Setting this parameter to `0` will remove the delay if needed.

#### Sample terminal command:
* Using `node` - `node dxsale-sniper-bot.js -- dxSalePresaleContractAddress=0xab5801a7d398351b8be11c439e05c5b3259aec9b buyingBnbAmount=0.5 senderPrivateKey=0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f createLogs=true gasPrice=25`
* Using `pm2` - `pm2 start dxsale-sniper-bot.js -- dxSalePresaleContractAddress=0xab5801a7d398351b8be11c439e05c5b3259aec9b buyingBnbAmount=0.5 senderPrivateKey=0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f createLogs=true gasPrice=25`

If you wish to use the bot at same time for multiple crypto tokens you could make several pm2 instances by passing `--name` parameter to the pm2 command. Example: `--name "app name"`.