const colors = require('colors');

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