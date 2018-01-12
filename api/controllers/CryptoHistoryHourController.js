/**
 * CryptoHistoryDayController
 *
 * @description :: Server-side logic for managing cryptohistorydays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var rp = require('request-promise');

module.exports = {

  /**
   * Insert crypto list to the database
   */

  getCryptoHistoryHour: function (req, res) {
    const crypto = req.params.shortName;
    Crypto.findOne({short_name: crypto})
      .exec(function (err, cryptoData){
        if (err) { return res.serverError(err); }
        var currentHour = new Date(cryptoData.last_histohour_update*1000).getHours();
        var currentDay = new Date(cryptoData.last_histohour_update*1000).getDay();
        var thisHour = new Date().getHours();
        var thisDay = new Date().getDay();
        console.log(thisDay);
        console.log(currentDay);
        if (thisDay === currentDay && thisHour <= currentHour) {
          res.json(false);
        } else {
          sails.log('Not equals today.');
          const toCurrency = 'USD';
          const uri = 'https://min-api.cryptocompare.com/data/histohour?fsym=' + crypto + '&tsym=' +
            toCurrency + '&limit=60&aggregate=3&e=CCCAGG';
          rp({uri: uri, json: true})
            .then(function(result) {
              if (result) {
                var data = result.Data;
                // Insert new records
                for (var i = data.length-1; i >= 0; i--) {
                  if (cryptoData.last_histohour_update >= data[i].time) {
                    console.log('Found exist times, breaking');
                    break;
                  }
                  // Insert a new record if not exists
                  const histoInstance = {
                    crypto_id: cryptoData.id,
                    to_currency: toCurrency,
                    time: data[i].time,
                    low: data[i].low,
                    high: data[i].high,
                    open: data[i].open,
                    close: data[i].close,
                    volume_from: data[i].volumefrom,
                    volume_to: data[i].volumeto
                  };
                  CryptoHistoryHour.create(histoInstance).exec(function (err, finn) {
                    if (err) {
                      return res.serverError(err);
                    }
                    sails.log('HistoHour for ' + finn.crypto_id + ' created successfully');
                  });
                }
                // Update last insert
                Crypto.update({short_name: crypto}, { last_histohour_update: result.TimeTo})
                  .exec(function afterwards(err, updated){
                    sails.log('Updated last histohour');
                    if (err) {
                      res.serverError(err);
                      return;
                    }
                  });
              }
              CryptoHistoryHour.find({}).exec(function(err, histoList) {
                if (err) { return res.serverError(err); }
                sails.log('Time to show records');
                res.json(histoList);
                return;
              });
            }).catch(function (err) {
            sails.log(err);
          });
        }
      });
  }

};

