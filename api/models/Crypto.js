/**
 * Crypto.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'cryptos',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    external_id: {
      type: 'integer',
      unique: true
    },
    short_name: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    image_url: {
      type: 'string'
    },
    algorithm: {
      type: 'string'
    },
    proof_type: {
      type: 'string'
    },
    price: {
      type: 'float'
    },
    total_coin_supply: {
      type: 'string'
    },
    featured: {
      type: 'boolean'
    },
    last_histoday_update: {
      type: 'integer'
    },
    last_histohour_update: {
      type: 'integer'
    },
    last_histominute_update: {
      type: 'integer'
    },
    last_price_update: {
      type: 'datetime'
    },
    dayHistory: {
      collection: 'cryptohistoryday',
      via: 'crypto_id'
    },
    hourHistory: {
      collection: 'cryptohistoryhour',
      via: 'crypto_id'
    },
    trades_from: {
      collection: 'trade',
      via: 'crypto_from'
    },
    trades_to: {
      collection: 'trade',
      via: 'crypto_to'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.last_histoday_update;
      delete obj.last_histohour_update;
      delete obj.last_histominute_update;
      delete obj.last_price_update;
      return obj;
    }
  }
};

