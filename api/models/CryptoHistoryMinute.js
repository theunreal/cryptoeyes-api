/**
 * CryptoHistoryDay.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'crypto_history_minute',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    crypto_id: {
      type: 'integer'
    },
    to_currency: {
      type: 'string'
    },
    time: {
      type: 'integer'
    },
    low: {
      type: 'float'
    },
    high: {
      type: 'float'
    },
    open: {
      type: 'float'
    },
    close: {
      type: 'float'
    },
    volume_from: {
      type: 'float'
    },
    volume_to: {
      type: 'float'
    },
    crypto_id: {
      model: 'crypto'
    }
  }
};

