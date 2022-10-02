const express = require('express'),
router = express.Router(),
moment = require('moment');

const {isEmpty, isNumeric} = require('../utils/validation');
const expenseData = require('../models/Expense/expenseModel');
const { ObjectId } = require('mongodb');
const { generator } = require('../utils/sequence');

router.post('/query/get', async (req, res) => {
  let query = JSON.parse(req.body.models);

  let limit =
    isEmpty(req.body.limit) ||
    !isNumeric(req.body.limit) ||
    parseInt(req.body.limit) > 20
      ? 20
      : parseInt(req.body.limit);
  let skip =
    isEmpty(req.body.skip) ||
    !isNumeric(req.body.skip) ||
    parseInt(req.body.skip)
      ? 0
      : parseInt(req.body.skip);

  let queryCount = await expenseData.countDocuments(query);
  let expense = await expenseData
    .find(query)
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    success: true,
    total: queryCount,
    data: expense,
  });
});

router.post('/update', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];
    
  model.modified_date = moment().toDate();

  await expenseData.updateOne(
    {'_id': model._id}, 
    {$set: model}
  )
  .then(async (res) => {
    console.log("Successfully updated a expense");
  })
  .catch(err => {
    if (err) {
      console.log("Failed to delete a expense");
      throw err;
    }
  })

  res.status(200).send({data: [model]});
});

router.post('/delete', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];

  await expenseData.deleteOne(
    {'_id': model._id}
  )
  .then(async (res) => {
    console.log("Successfully deleted a expense");
  })
  .catch(err => {
    if (err) {
      console.log("Failed to delete a expense");
      throw err;
    }
  })

  res.status(200).send({data: [model]});

});

router.post('/create', async (req, res) => {
  let model = JSON.parse(req.body.models)[0];
  let transactionId = ObjectId();
  let sequence = await generator("expense_number", 2, 5, "EXP-");

  model.transaction_number = sequence;
  model.posted_date = moment().toDate();
  model.item_reference = transactionId;
  delete model._id;

  expenseData.create(model, async (err, result)=>{
    if (err)
    {
      console.log("Failed to create a new expense");
      throw err;
    }
    model._id = result._id;
    console.log("Successfully created a new expense.");
    res.status(200).send({data: [model]});
  });
});

router.get('/get', (req, res) => {
  expenseData.find({},(err,result)=>{
    if (err) throw err;
    return res.status(200).send(result);
  });
});

module.exports = router;