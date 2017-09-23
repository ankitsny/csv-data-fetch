const express = require('express');

const router = express.Router();

const CSVController = require('../controllers/CSVController');

/* GET home page. */
router.get('/', (req, res, next) => res.render('index'));

router.get('/get', CSVController.getQuestions);

router.get('/get/:key', CSVController.getQuestion);

router.post('/question', CSVController.postQuestion);

router.patch('/update', CSVController.updateCSV);

module.exports = router;
