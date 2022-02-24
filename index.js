const fs = require('fs');	//для работы с файловой системой
const yargs = require('yargs');	//для работы с аргументами
const path = require('path');	//для работы с путями

//настройка и считывание переднных пользователм аргументов
const options = yargs
	.usage('usage: -p <pats to the file>').option('p', {
		alias: 'path',
		describe: 'Path to the file',
		type: 'string',
		demandOption: false,
	})
	.option('f', {
		alias: 'find',
		describe: 'string or pattern for find',
		type: 'string',
		demandOption: false,
	}).argv;

//console.log(options);

var pathForStart = '.';
if (options.p !== undefined) {
	pathForStart = options.p;
}
else {
	pathForStart += path.sep;
}

var writeFile = function (usingPath, findString) {
	const readStream = fs.createReadStream(usingPath, 'utf-8');

	const readLine = require('readline');

	const rl = readLine.createInterface({
		input: readStream,
		terminal: true
	})
	var isFind = false;
	rl.on('line', (line) => {
		if (findString === undefined || line.includes(findString)) {
			console.log(line);
			isFind = true;
		}
	});

	readStream.on('end', () => {
		if (findString !== undefined && isFind == false) {
			console.log("Совпадений не найдено");
		}
	});

}


var showWolderContent = function (usingPath) {

	var currentPath = '';
	if (path.isAbsolute(usingPath)) {	//если передан на абсолютный путь, то превращаем его в абсолютный
		currentPath = usingPath;
	}
	else {
		currentPath = path.resolve(usingPath);
	}


	const isFile = (fileName) => fs.lstatSync(fileName).isFile();

	const fileList = fs.readdirSync(currentPath);//.filter(isFile);

	const showItems = [];

	fileList.forEach((name) => {
		showItems.push(
			name
		);
	});

	const inquirer = require('inquirer');

	console.log("Текущее положение: " + currentPath);

	inquirer.prompt([
		{
			name: 'fileName',
			type: 'list',
			message: 'Выберите',
			choices: showItems,
		}
	]).then(({ fileName }) => {
		var newPath = path.join(currentPath, fileName);
		if (isFile(newPath)) {	//в случае еслт выбран файл, то обработка файла
			console.log(`Выбран ${fileName}`);
			writeFile(newPath, options.f);
		}
		else {	//если выюрана папка то перезапускаем функцию рекурсивно
			showWolderContent(newPath);
		}
	});
}

showWolderContent(pathForStart);