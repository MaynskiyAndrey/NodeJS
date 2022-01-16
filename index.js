const { match } = require('assert');
const EventEmmiter = require('events');
const emitter = new EventEmmiter();

const args = process.argv.slice(2);

const getDateTime = (param) => {
	let dateItems = param.split('-');
	return new Date(dateItems[3], dateItems[2] - 1, dateItems[1], dateItems[0]);
};

let dates = [args.length];

for (let i = 0; i < args.length; i++) {
	let date = getDateTime(args[i]);
	dates[i] = date.getTime();
}


const printRes = (miliseconds) => {

	let allSeconds = miliseconds / 1000 - (miliseconds % 1000 / 1000);
	let seconds = allSeconds % 60;
	let allMinutes = allSeconds / 60 - seconds / 60;

	let minutes = allMinutes % 60;
	let allHours = allMinutes / 60 - minutes / 60;

	let hours = allHours % 24;
	let allDays = allHours / 24 - hours / 24;

	let days = allDays % 365;
	let allYears = allDays / 365 - days / 365;
	let result = 'Осталось';
	if (allYears > 0) {
		result += ` лет ${Math.ceil(allYears)}`;
	}
	if (days > 0) {
		result += ` дней ${Math.ceil(days)}`;
	}
	if (hours > 0) {
		result += ` часов ${Math.ceil(hours)}`;
	}
	if (minutes > 0) {
		result += ` минут ${Math.ceil(minutes)}`;
	}
	result += ` секунд ${Math.ceil(seconds)}`;
	console.log(result);
}

emitter.on('newStep', (param) => {
	printRes(param);
});

emitter.on('endTimer', (p) => { console.log('Таймер закончен'); });


const run = async (dates) => {

	let curTime = new Date().getTime();

	let endCount = 0;
	for (let i = 0; i < dates.length; i++) {
		let countMileseconds = dates[i] - curTime;

		if (countMileseconds > 0) {
			endCount++;
			emitter.emit('newStep', countMileseconds);
		}
		else {
			emitter.emit('endTimer', '');
		}
	}

	let resArray = [endCount];
	let j = 0;
	for (let i = 0; i < dates.length; i++) {
		let countMileseconds = dates[i] - curTime;

		if (countMileseconds > 0) {
			resArray[j++] = dates[i];
		}
	}


	await new Promise((resolve) => setTimeout(resolve, 1000));

	if (resArray.length > 0) {
		run(resArray);
	}
}


run(dates);

/*const colors = require('colors');

const [minNumber, maxNumber] = process.argv.slice(2);

if (!parseInt(minNumber) || !parseInt(maxNumber)) {
	console.log(`Границ должны быть числами`);
	return;
}

let usingMinNum = +minNumber;
let usingMaxNum = +maxNumber;

if (usingMinNum > usingMaxNum) {
	usingMaxNum = +minNumber;
	usingMinNum = +maxNumber;
}

console.log(`Диапазон ${usingMinNum} - ${usingMaxNum}`);

if (usingMinNum < 2) {
	usingMinNum = 2;
}

let counter = 0;
for (let curNumber = usingMinNum; curNumber <= usingMaxNum; curNumber++) {
	if (isSimpleNumber(curNumber)) {
		counter++;
		switch (counter % 3) {
			case 1: {
				console.log(colors.green(curNumber));
				break;
			}
			case 2: {
				console.log(colors.yellow(curNumber));
				break;
			}
			case 0: {
				console.log(colors.red(curNumber));
				break;
			}
		}

	}
}

if (counter == 0) {
	console.log(colors.red("Простых чисел в диапазоне нет."));
}

function isSimpleNumber(num) {
	let isSimple = true;
	for (let i = (num - num % 2) / 2; i > 1; i--) {
		if (num % i == 0) {
			isSimple = false;
			break;
		}
	}
	return isSimple;
}
*/

