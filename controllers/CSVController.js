
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const FILE_NAME = 'ranking.csv';

const qMap = {};
const headers = 'QUESTION,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK\n';

fs.createReadStream(path.join(FILE_NAME))
  .pipe(csv())
  .on('csv', (csvRow, rowIndex) => {
    const temp = {};
    qMap[csvRow[0]] = csvRow;
  })
  .on('finish', () => {
    console.log('File Read: Completed');
  });

exports.getQuestions = async (req, res) => {
  const matchedQuestion = Object.keys(qMap).filter((key) => {
    const tmp = new RegExp(req.query.key, 'i');
    if (key.match(tmp)) return key;
    return false;
  });
  res.status(200).send(matchedQuestion);
};


exports.getQuestion = async (req, res) => {
  const questionDetails = qMap[req.params.key];
  if (!questionDetails) return res.status(404).send({ message: 'Not found' });
  return res.status(200).send(questionDetails);
};

exports.updateCSV = async (req, res) => {
  const { key, index, value } = req.body;
  if (!qMap[key]) { return res.status(400).send({ message: 'Bad Request' }); }
  qMap[key][index] = value;
  return writeFile()
    .then(resp => res.status(200).send({ message: 'updated' }))
    .catch(err => res.status(500).send({ message: 'Internal Error' }));
};

exports.postQuestion = async (req, res) => {
  const { question } = req.body;
  if (qMap[question]) return res.status(400).send({ message: 'Question already exists' });
  return appendFile(question)
    .then(resp => res.status(200).send({ message: 'Question Added' }))
    .catch(err => res.status(500).send({ message: 'Internal Error' }));
};

async function writeFile() {
  return new Promise((resolve, reject) => {
    let str = headers;
    Object.keys(qMap).forEach((data) => {
      str += `${qMap[data].toString()}\n`;
    });
    fs.writeFile(path.join(FILE_NAME), str, (err) => {
      if (err) return reject(err);
      return resolve('done');
    });
  });
}


async function appendFile(question) {
  const tmpData = `${question},RANDOM TITLE,RANDOM BODY,RANDOM SOURCE-ID,RANDOM DOC-ID,RANDOM RANK,RANDOM TITLE,RANDOM BODY,RANDOM SOURCE-ID,RANDOM DOC-ID,RANDOM RANK,RANDOM TITLE,RANDOM BODY,RANDOM SOURCE-ID,RANDOM DOC-ID,RANDOM RANK,RANDOM TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK,TITLE,BODY,SOURCE-ID,DOC-ID,RANK\n`;
  return new Promise((resolve, reject) => {
    fs.appendFile(path.join(FILE_NAME), tmpData, (err) => {
      if (err) return reject(err);
      qMap[question] = tmpData.split(',');
      return resolve('done');
    });
  });
}

