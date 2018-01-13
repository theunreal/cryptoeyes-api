/**
 * TradeController
 *
 * @description :: Server-side logic for managing trades
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  list: function(req,res) {
    Trade.find({})
      .populate('user_id', { select: ['first_name']})
      .populate('crypto_from')
      .populate('crypto_to')
      .exec(function(err, result) {
        res.json(result);
      });
  }

};

