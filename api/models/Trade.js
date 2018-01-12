/**
 * Trade.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    user_id: {
      model: 'user'
    },
    crypto_from: {
      model: 'crypto'
    },
    crypto_to: {
      model: 'crypto'
    }
  }
};

