const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
port = 3000;

function createCounter(initValue) {
    let val = initValue;
    return {
        increment() {val++;},
        decrement() {val--;},
        getValue() {return val;}
    }
}

// Структура JSON:

// {
//     "url1": runningURLCount,
//     "url2": runningURLCount
// }

// Например так:

// {
//     "root": rootCount,
//     "about": aboutCount
// }

let countersJSON = {};

const countersJSONPath = path.join(__dirname, 'countersJSON.json');

function saveKeyValueToJSON (key, value, someJSON, saveTo) {
    someJSON[key] = value;
    fs.writeFileSync(saveTo, JSON.stringify(someJSON, null, 2));
}


// Если файл json существует читаем, иначе пишем в новый файл json пустой объект
if (fs.existsSync(countersJSONPath)) {
    countersJSON = JSON.parse(fs.readFileSync(countersJSONPath));
} else {
    fs.writeFileSync(countersJSONPath, JSON.stringify(countersJSON));
}


const rootCount = createCounter((countersJSON.root) ? countersJSON.root : 0);
const aboutCount = createCounter((countersJSON.about) ? countersJSON.about : 0);


app.get("/", (req, res) => {

    rootCount.increment();

    saveKeyValueToJSON('root', rootCount.getValue(), countersJSON, countersJSONPath);

    res.send(`<h1>Корневая страница</h1>
        <p>Просмотров: ${rootCount.getValue()}</p>
        <a href="/about">Ссылка на страницу /about</a>`);
});

app.get("/about", (req, res) => {
    
    aboutCount.increment();

    saveKeyValueToJSON('about', aboutCount.getValue(), countersJSON, countersJSONPath);

    res.send(`<h1>Страница about</h1>
        <p>Просмотров: ${aboutCount.getValue()}</p>
        <a href="/">Ссылка на страницу /</a>`);
});

app.listen(port, () => {
    console.log(`Сервер запущен на ${port} порту`);
});
