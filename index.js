//npm run start_3 команда для запуска в соответствии с заданием
const fs = require('fs');
const filePath = './access.log';

const params = process.argv.splice(2);


const writeStreams = new Map();

const allKeyStat = "all";
const statistics = new Map();
statistics.set(allKeyStat, 0);

params.forEach(element => {
	writeStreams.set(element, fs.createWriteStream(
		`./${element}_requests.log`,
		{ encoding: 'utf-8' }
	));

	statistics.set(element, 0);
});

const addStat = (key) => {
	let statVal = statistics.get(key);
	statVal++;
	statistics.set(key, statVal);
}



const readStream = fs.createReadStream(
	filePath,
	'utf-8',
	{ highWaterMark: 5 }
);

let prevPart = '';

const regexEndStr = new RegExp("\/[0-9]+\.[0-9]+\.[0-9]+\"");
const regexStartStr = new RegExp("[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+");


readStream.on('data', (chunk) => {

	let items = chunk.split('\n');

	items.forEach(element => {

		let testLine = prevPart + element;
		if (regexStartStr.test(testLine)) {
			if (regexEndStr.test(testLine)) {

				addStat(allKeyStat);

				prevPart = '';
				writeStreams.forEach((writeStream, ip, collect) => {
					if (testLine.includes(ip)) {
						//console.log(`${ip} : ${testLine}`);
						writeStream.write(testLine);
						writeStream.write(require('os').EOL);
						addStat(ip);
					}

				});
			}
			else {
				prevPart += element;
			}
		}
	});
});

readStream.on('end', () => {
	console.log(`Всего считано ${statistics.get(allKeyStat)}`);

	writeStreams.forEach((writeStream, ip, collect) => {
		writeStream.end(() => { console.log(`Записано по IP ${ip} : ${statistics.get(ip)}`); });
	});
});

readStream.on('error', (err) => {
	console.log(err);
})