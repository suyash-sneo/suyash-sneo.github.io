const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

const wordsModule = require('./words');

const port = 80;
const telegramApiUrl = "https://api.telegram.org/bot";
const telegramBotToken = "5520019939:AAEf97X671yyLu2ofC-KFyx66c6_izgDjxo";
const myChatId = 361109263;

const anotherIndex = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GetRandomWord() {
	
	let words = wordsModule.words;
	const len = words.length;

	index = getRandomInt(0, len+1);

	if (index>=0 && index<len) {
		return words[index];
	}
		
	word = words[anotherIndex];
	anotherIndex += 1;
	if(anotherIndex>=len)
		anotherIndex = 0;

	return word;
}

function GetVocabularyComLinkForWord(word) {
	return `https://www.vocabulary.com/dictionary/${word}`;
} 

function SendWordToBot(word) {
	let wordLink = GetVocabularyComLinkForWord(word);

	axios.post(`${telegramApiUrl}${telegramBotToken}/sendMessage`, {
		chat_id: myChatId,
		text: `WORD: ${word}\n${wordLink}`
	})
	.then((response) => {
		console.log(`Successfully sent word: "${word}"`);
		return;
	})
	.catch((error) => {
		console.log(`Error sending word ${word}; Error: ${error}`);
		return;
	})

	return;
}

function SendRandomWordToBot() {
	let word = GetRandomWord()
	SendWordToBot(word);
}



const job = schedule.scheduleJob('*/40 * * * * *', function(){
	SendRandomWordToBot();
  });


const app = express();

app.use(bodyParser.json());
app.get('/', (req, res) => {
	res.status(200).send('WORD FEEDER BOT');
})
app.get('/healthcheck', (req, res) => {
	res.status(200).send('SERVER IS LIVE')
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});