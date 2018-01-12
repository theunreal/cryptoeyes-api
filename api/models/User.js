/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    id: {
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      type: 'integer'
    },
    email: {
      type: 'email',
      unique: true
    },
    first_name: {
      type: 'string'
    },
    last_name: {
      type: 'string'
    },
    dob: {
      type: 'datetime'
    },
    reputation: {
      type: 'number'
    },
    trades: {
      collection: 'trade',
      via: 'user_id'
    }


  }
};

