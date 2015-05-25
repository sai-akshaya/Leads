'use strict';

var _ = require('lodash');
var Deal = require('./deal.model');

//Error handling
var validationError = function (res, err) {
  return res.status(422).json(err);
};

function handleError(res, err) {
  return res.status(500).json(err);
};


// Get list of deals
exports.index = function(req, res) {
  Deal.find(function (err, deals) {
    if(err) { return handleError(res, err); }
    return res.json(200, deals);
  });
};

// Get a single deal
exports.show = function(req, res) {
  Deal.findById(req.params.id, function (err, deal) {
    if(err) { return handleError(res, err); }
    if(!deal) { return res.sendStatus(404); }
    return res.json(deal);
  });
};

// Gets all deals assigned to a particular coordinator/core
exports.myDeals = function(req, res) {
  Deal.find({ assignees: req.user.id }, function (err, deals) {
    if(err) { return handleError(res, err); }
    if(!deals) { return res.sendStatus(404); }
    return res.json(deals);
  });
};

// Creates a new deal in the DB.
exports.create = function(req, res) {
  req.body.createdOn=Date.now();
  Deal.create(req.body, function(err, deal) {
     if (err) { console.log(err); return validationError(res, err); }
     return res.json(201, deal);
  });
};
// Updates an existing deal in the DB.
exports.update = function(req, res) {
  req.body.updatedOn=Date.now();
  if(req.body._id) { delete req.body._id; }
  Deal.findById(req.params.id, function (err, deal) {
    if (err) { return handleError(res, err); }
    if(!deal) { return res.sendStatus(404); }
    var updated = _.merge(deal, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, deal);
    });
  });
};

// Deletes a deal from the DB.
exports.destroy = function(req, res) {
  Deal.findById(req.params.id, function (err, deal) {
    if(err) { return handleError(res, err); }
    if(!deal) { return res.sendStatus(404); }
    deal.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.sendStatus(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}