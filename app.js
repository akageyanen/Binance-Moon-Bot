"use strict"
const Discord = require('discord.js');
const binance = require('node-binance-api');
const hook = new Discord.WebhookClient('' , '');
require('dotenv').config();


  binance.options({
    APIKEY: process.env.BN_APIKEY,
    APISECRET: process.env.BN_SECRET,
    useServerTime: true
  });

  binance.prices((error, ticker) => {
    let relevantTickers = Object.keys(ticker).reduce((tickers, pair) => {

      if (pair.endsWith('BTC')) {
        tickers.push(pair);
      }
      if (pair.startsWith('TRIG') || pair.startsWith('DENT')) {
        tickers.pop(pair);
      }
      return tickers;
    }, [])

    relevantTickers.map((each) => {
      binance.candlesticks(each, "2h",(error, ticks, symbol) => {
        let last_tick = ticks[ticks.length -1];
        let first_tick = ticks[0];
        let change = (parseFloat(last_tick[4]) - parseFloat(first_tick[4]))/parseFloat(first_tick[4]);
        if (change*100 > 7) {
          const change_data = symbol+"が" + change*100 + '上昇しました' ;
          console.log(change_data);
          // hook.send(change_data);
        }
      },{limit: 3})
    })
  });
