![alt text](https://github.com/mnedelchev-vn/pinksale-dxsale-sniper-bot/blob/master/assets/images/pinksale-logo.png)
![alt text](https://github.com/mnedelchev-vn/pinksale-dxsale-sniper-bot/blob/master/assets/images/dxsale-logo-shadow.png)

# Pinksale & DxSale sniper bot

## Purpose
This bot allows you to compete with other trading bots when buying a cryptocurrency which is going to be sold as a presale on Pinksale or DxSale launch platforms.

## Grateful users & donations
This sniper bot is **fully free** and it was never meant to be paid. However if you appreciate my work I accept donations at **0x5ADD71300d924213456b037b5be25020C62D9e08**. The real rockstars will follow my twitter as well:

[![Twitter URL](https://github.com/mnedelchev-vn/pinksale-dxsale-sniper-bot/blob/master/assets/images/twitter.svg)](https://twitter.com/intent/follow?screen_name=mnedelchev_)

## Features
* Including transaction options like gas price, gas limit, etc
* Multi-address transactions ( by default Pinksale or DxSale launch platforms allows each address to participate once at a particular sale so you can setup multiple addresses to join the presale )
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
* `presaleContractAddress` - this is the Pinksale or DxSale presale contract address **( not the contract address of the token you're willing to buy )**. String, 42 bytes size starting with `0x`.

Example **Pinksale**:
![alt text](https://github.com/mnedelchev-vn/pinksale-dxsale-sniper-bot/blob/master/assets/images/sample-pinksale-presale-address.png)

Example **DxSale**:
![alt text](https://github.com/mnedelchev-vn/pinksale-dxsale-sniper-bot/blob/master/assets/images/sample-dxsale-presale-address.png)

**WARNING!** - This is a sample Presale address, do not use it! Each token Pinksale or DxSale presale has unique Presale contract address.

* `buyingBnbAmount` - this is the amount of BNB which you are willing to use to execute the buying transaction. Integer or float.
* `senderPrivateKey` - this is the private key of the wallet address which will be used to execute the buying transaction. For multi-address transactions then list the private keys separated by `,`. *( Example - `senderPrivateKey=0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f,0x3da3ef21b123d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b42de8E`. )* Each private key have to have 66 bytes size starting with `0x`. *If you're using MetaMask then you will have to manually add `0x` at the beginning of your private key, because MetaMask is displaying the private key with 64 bytes size.*

#### Optional parameters:
* `node` - by default the bot will be using a standard BSC node. This node will be enough for signing transactions, but however if you want be fast as possible in presales you should find your self a fast node ( usually they're not free ). When you're able to provide a node better than the standard one you can pass it as `node` parameter. The node has to be full URI to the RPC endpoint, example: `https://localhost:8545`.
* `gasLimit` - the maximum amount of gas you are willing to consume on a transaction, default value is 500000.
* `gasPrice` - the transaction gas price in Gwei, default value is 10 Gwei.
* `createLogs` - boolean, if set to `true` it will create ./logs folder and save logs on different bot actions.
* `cronTime` - how often should the bot try to buy the particular token. Default is `'*/100 * * * * * *'` aka every 100 milliseconds.
* `botInitialDelay` - by default when starting the bot for first time it has 10 seconds delay to double check what parameters have been passed. Setting this parameter to `0` will remove the delay if needed.

#### Sample terminal command:
* Using `node` - `node sniper-bot.js -- presaleContractAddress=0xab5801a7d398351b8be11c439e05c5b3259aec9b buyingBnbAmount=0.5 senderPrivateKey=0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f createLogs=true gasPrice=25`
* Using `pm2` - `pm2 start sniper-bot.js -- presaleContractAddress=0xab5801a7d398351b8be11c439e05c5b3259aec9b buyingBnbAmount=0.5 senderPrivateKey=0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f createLogs=true gasPrice=25`

If you wish to use the bot at same time for multiple crypto tokens you could make several pm2 instances by passing `--name` parameter to the pm2 command. Example: `--name "app name"`.