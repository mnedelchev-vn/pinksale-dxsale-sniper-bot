#!/usr/bin/ nodejs
const fs = require('fs');
const Cronr = require('cronr');
const Web3 = require('web3');

console.log('Welcome to DxSale Sniper bot!');

var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org:443'));
var chainId = 56;
// ======================== DEFAULT CONFIG ========================
var gasLimit = 500000; // in gwei
var gasPrice = 10; // in gwei
var createLogs = false;
var cronTime = '*/100 * * * * * *'; // every 10 milliseconds
var botInitialDelay = 10000;
// ======================== /DEFAULT CONFIG ========================

var logsDir = __dirname + '/logs/';
var logsPath = logsDir + 'dxsale-sniper-bot-' + new Date().toISOString().slice(0,10) + '.txt';

const projectData = {
    utils: {
        createLog: function(content) {
            if (createLogs) {
                if (fs.existsSync(logsPath)) {
                    content = '\r\n' + new Date().toUTCString() + ': ' + content;
                    console.log(content);
                }
                fs.appendFile(logsPath, content, function (err) {
                    if (err) throw err;
                });
            }
        },
        propertyExists: function(object, key) {
            return object ? hasOwnProperty.call(object, key) : false;
        }
    }
};

// reading params
var params = process.argv.slice(2);
var args = {};
for (var i = 0, len = params.length; i < len; i+=1) {
    var key_value = params[i].split('=');
    args[key_value[0]] = key_value[1];
}

async function initBotLogic() {
    // ======================== REQUIRED PARAMETERS ========================
    if (!projectData.utils.propertyExists(args, 'dxSalePresaleContractAddress') || args.dxSalePresaleContractAddress == '' || args.dxSalePresaleContractAddress == null || args.dxSalePresaleContractAddress == undefined || args.dxSalePresaleContractAddress.length != 42 || await web3.eth.getCode(args.dxSalePresaleContractAddress) == '0x') {
        return console.error('Missing or wrong dxSalePresaleContractAddress parameter. dxSalePresaleContractAddress must be contract address.');
    } else if (!projectData.utils.propertyExists(args, 'buyingBnbAmount') || args.buyingBnbAmount == '' || args.buyingBnbAmount == null || args.buyingBnbAmount == undefined) {
        return console.error('Missing or wrong buyingBnbAmount parameter.');
    } else if (!projectData.utils.propertyExists(args, 'senderPrivateKey') || args.senderPrivateKey == '' || args.senderPrivateKey == null || args.senderPrivateKey == undefined) {
        return console.error('Missing or wrong senderPrivateKey parameter.');
    }

    var buyingBnbAmount = args.buyingBnbAmount;
    var dxSalePresaleContractAddress = args.dxSalePresaleContractAddress;

    // validate the private key or keys
    var senderPrivateKey = args.senderPrivateKey;
    var privateKeys = [];
    if (senderPrivateKey.indexOf(',') > -1) {
        privateKeys = senderPrivateKey.split(',');
    } else {
        privateKeys.push(senderPrivateKey);
    }

    var addressesUsedToSendTransactions = '';
    var firstIteration = true;
    for (var i = 0, len = privateKeys.length; i < len; i+=1) {
        if (privateKeys[i].length != 66) {
            return console.error('One or more of the private keys are invalid.');
        }

        if (firstIteration) {
            firstIteration = false;
            addressesUsedToSendTransactions += web3.eth.accounts.privateKeyToAccount(privateKeys[i]).address;
        } else {
            addressesUsedToSendTransactions += ', ' + web3.eth.accounts.privateKeyToAccount(privateKeys[i]).address;
        }
    }
    // ======================== /REQUIRED PARAMETERS ========================

    // ======================== CHANGING DEFAULT PARAMETERS IF THEY ARE PASSED ========================
    console.log('Addresses used to send the transactions: ' + addressesUsedToSendTransactions);
    gasLimit = (projectData.utils.propertyExists(args, 'gasLimit') && args.gasLimit != '' && args.gasLimit != null && args.gasLimit != undefined) ? args.gasLimit : gasLimit;
    console.log('Gas limit: ' + gasLimit);
    gasPrice = (projectData.utils.propertyExists(args, 'gasPrice') && args.gasPrice != '' && args.gasPrice != null && args.gasPrice != undefined) ? args.gasPrice * 1000000000 : gasPrice * 1000000000;
    console.log('Gas price: ' + (gasPrice / 1000000000) + ' Gwei');
    createLogs = (projectData.utils.propertyExists(args, 'createLogs') && args.createLogs === 'true') ? true : createLogs;
    console.log('Creating logs: ' + createLogs);
    cronTime = (projectData.utils.propertyExists(args, 'cronTime') && args.cronTime != '' && args.cronTime != null && args.cronTime != undefined) ? args.cronTime : cronTime;
    console.log('Cron time: ' + cronTime);
    botInitialDelay = (projectData.utils.propertyExists(args, 'botInitialDelay') && args.botInitialDelay != '' && args.botInitialDelay != null && args.botInitialDelay != undefined) ? args.botInitialDelay : botInitialDelay;
    console.log('Bot initial delay: ' + botInitialDelay);
    // ======================== /CHANGING DEFAULT PARAMETERS IF THEY ARE PASSED ========================

    // if logs dir missing then create it
    if (createLogs && !fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    if (botInitialDelay > 0) {
        console.log('Starting the DxSale Sniper bot in ' + (botInitialDelay / 1000) + ' seconds... ¯\\_(*o*)_/¯');
    } else {
        console.log('Starting the DxSale Sniper bot now... ¯\\_(*o*)_/¯');
    }

    setTimeout(function () {
        var executeBuy = true;
        const job = new Cronr(cronTime, function() {
            projectData.utils.createLog('Cronjob iteration.');
            if (executeBuy) {
                executeBuy = false;

                var counter = 0;
                return recursiveTransactionsLoop(counter);

                function recursiveTransactionsLoop(counter) {
                    var senderAddress = web3.eth.accounts.privateKeyToAccount(privateKeys[counter]).address;

                    web3.eth.estimateGas({to: dxSalePresaleContractAddress, from: senderAddress, value: web3.utils.toHex(web3.utils.toWei(buyingBnbAmount, 'ether'))}, function(gasEstimateError, gasAmount) {
                        if (!gasEstimateError) {
                            projectData.utils.createLog('Transaction estimation successful: ' + gasAmount);

                            var txParams = {
                                gas: web3.utils.toHex(gasLimit),
                                gasPrice: web3.utils.toHex(gasPrice),
                                chainId: chainId,
                                value: web3.utils.toHex(web3.utils.toWei(buyingBnbAmount, 'ether')),
                                to: dxSalePresaleContractAddress
                            };

                            web3.eth.accounts.signTransaction(txParams, privateKeys[counter], function (signTransactionErr, signedTx) {
                                if (!signTransactionErr) {
                                    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (sendSignedTransactionErr, transactionHash) {
                                        if (!sendSignedTransactionErr) {
                                            if (counter == privateKeys.length - 1) {
                                                if (privateKeys.length == 1) {
                                                    projectData.utils.createLog('Completed first and only transaction. Transaction hash: ' + transactionHash);
                                                } else {
                                                    projectData.utils.createLog('Completed last transaction. Transaction hash: ' + transactionHash);
                                                }
                                            } else {
                                                projectData.utils.createLog('Completed transaction. Transaction hash: ' + transactionHash);
                                                counter+=1;
                                                return recursiveTransactionsLoop(counter);
                                            }
                                        } else {
                                            executeBuy = true;
                                            if (sendSignedTransactionErr.message) {
                                                projectData.utils.createLog('Method web3.eth.sendSignedTransaction failed. Message: ' + sendSignedTransactionErr.message);
                                            } else {
                                                projectData.utils.createLog('Method web3.eth.sendSignedTransaction failed. Message: ' + sendSignedTransactionErr.toString());
                                            }

                                            if (counter != privateKeys.length - 1) {
                                                counter+=1;
                                                return recursiveTransactionsLoop(counter);
                                            }
                                        }
                                    });
                                } else {
                                    executeBuy = true;
                                    if (signTransactionErr.message) {
                                        projectData.utils.createLog('Method web3.eth.accounts.signTransaction failed. Message: ' + signTransactionErr.message);
                                    } else {
                                        projectData.utils.createLog('Method web3.eth.accounts.signTransaction failed. Message: ' + signTransactionErr.toString());
                                    }

                                    if (counter != privateKeys.length - 1) {
                                        counter+=1;
                                        return recursiveTransactionsLoop(counter);
                                    }
                                }
                            });
                        } else {
                            executeBuy = true;
                            if (gasEstimateError.message) {
                                projectData.utils.createLog('Method web3.eth.estimateGas() failed. Message: ' + gasEstimateError.message);
                            } else {
                                projectData.utils.createLog('Method web3.eth.estimateGas() failed. Message: ' + gasEstimateError.toString());
                            }

                            if (counter != privateKeys.length - 1) {
                                counter+=1;
                                return recursiveTransactionsLoop(counter);
                            }
                        }
                    });
                }
            }
        }, {});
        job.start();
    }, botInitialDelay);
}
initBotLogic();