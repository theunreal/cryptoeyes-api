/**
 * CryptoController
 *
 * @description :: Server-side logic for managing cryptoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var rp = require('request-promise');


module.exports = {

  /**
   * Get the crypto list from the database
   */
  getCryptos: function (req, res) {
          Crypto.find({ select: ['id', 'name', 'short_name', 'image_url', 'price', 'last_price_update'] })
            .sort('price DESC')
            .populate('dayHistory',{ sort: 'time DESC', limit: 1})
            .limit(16)
            .exec(function (err, finn){
            if (err) { return res.serverError(err); }

            //Check if we need to update crypto price snapshot (10 min)
            var cryptosToUpdate = [];
            for (var i = 0; i <= finn.length - 1; i++) {
              if (new Date(finn[i].last_price_update).getTime() + 1.8e+6 < new Date().getTime()) {
                cryptosToUpdate.push(finn[i].short_name);
              }
              // Check price trend
              if (finn[i].dayHistory.length) {
                const lastRecord = finn[i].dayHistory[0];
                if (lastRecord) {
                  finn[i].priceTrend = (((finn[i].price - lastRecord.close) / lastRecord.close) * 100).toFixed(2);
                  finn[i].yesterdayTrend = (((lastRecord.close - lastRecord.open) / lastRecord.open) * 100).toFixed(2);
                }
              }
            }

            if (cryptosToUpdate.length) {
              // Get new prices
              console.log('Time to update prices');
              getNewPrices(cryptosToUpdate, finn, res);
            } else {
              res.json(finn);
            }
          });
  },

  /**
   * Get the crypto list from the database
   */
  getCrypto: function (req, res) {
    Crypto.findOne({short_name: req.params.shortName})
      .populate('dayHistory', {sort: 'time ASC'})
      .populate('hourHistory', {sort: 'time ASC'})
      .exec(function (err, finn){
        if (err) { return res.serverError(err); }
        var today = new Date();
        today.setHours(2);
        today.setMinutes(0);
        today.setSeconds(0);
        today = parseInt(today.getTime() / 1000);
        var needWait;
        /**
         * Check if we have history data - DAY
         */
        if (finn) {
         if (!finn.dayHistory.length || finn.last_histoday_update !== today) {
            console.log('Need dayHistory update');
            needWait = true;
            rp('http://localhost:8100/api/cryptoHistoryDay/view/' + finn.short_name)
              .then(function (result) {

              })
          } else if (!finn.hourHistory.length || finn.last_histohour_update < Date.now() / 1000) {
            needWait = true;
            /**
             * Check if we have history data - HOUR
             */
            rp('http://localhost:8100/api/cryptoHistoryHour/view/' + finn.short_name)
              .then(function (result) {

              })
          } else {
            res.json(finn);
          }
        } else {
          res.json('Can\'t find crypto');
        }
        if (needWait) {
          setTimeout(function() {
            Crypto.findOne({short_name: req.params.shortName})
              .populate('dayHistory', {sort: 'time ASC'})
              .populate('hourHistory', {sort: 'time ASC'})
              .exec(function (err, finn) {
                return res.json(finn);
              });
          }, 1000)
        }
      });
  },

  /**
   * Insert crypto history data
   */
  insertCryptos: function (req, res) {
    rp('https://www.cryptocompare.com/api/data/coinlist/')
      .then(function(result) {
        result = JSON.parse(result);
        for (var key in result.Data) {
          const cryptoInstance = {
            external_id: result.Data[key].Id,
            short_name: result.Data[key].Name,
            image_url: result.Data[key].ImageUrl,
            name: result.Data[key].CoinName,
            algorithm: result.Data[key].Algorithm,
            proof_type: result.Data[key].ProofType,
            total_coin_supply: result.Data[key].TotalCoinSupply
          };
          Crypto.create(cryptoInstance).exec(function (err, finn){
            if (err) { return res.serverError(err); }
            sails.log('Coin ' + finn.name + ' created successfully');
          });
        }
        return res.send(result);
      });
  }
};

function getNewPrices(cryptos, finn, res) {
  console.log('Time to update the price for ' + cryptos);
  cryptos = cryptos.join(',');
  rp('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + cryptos + '&tsyms=USD')
    .then(function(records) {
      records = JSON.parse(records);
      var i = 0;
      for (var recordKey in records) {
        if (records.hasOwnProperty(recordKey)) {
          Crypto.update({short_name: Object.keys(records)[i]},
            {last_price_update: new Date(), price: records[recordKey].USD})
            .exec(function() {  });
        }
        i++;
      }
      console.log(i + " cryptos updated");
      res.json(finn);
    });

  function getPrices(cryptos, finn, res) {
    cryptos = cryptos.join(',');
    rp('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + cryptos + '&tsyms=USD')
      .then(function (records) {
        records = JSON.parse(records);
        var i = 0;
        var newPrices = [];
        for (var recordKey in records) {
          if (records.hasOwnProperty(recordKey)) {
            newPrices.push({
              name: Object.keys(records)[i],
              value: records[recordKey].USD
            });
            Crypto.update({short_name: Object.keys(records)[i]},
              {last_price_update: new Date(), price: records[recordKey].USD})
              .exec(function () {
              });
          }
          i++;
        }
        res.json(newPrices);
      });
  }
}

