const express = require('express');
const router = express.Router();
const { runQuery, getHistory, deleteHistory } = require('../controllers/query.controller');

router.post('/query', runQuery);
router.get('/query/history', getHistory);
router.delete('/query/history/:id', deleteHistory);

module.exports = router;
