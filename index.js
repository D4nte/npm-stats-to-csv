const registry = require('npm-stats')(["registry.npmjs.org"])
const { Parser } = require('json2csv');
const fs = require("fs");

let promises = []

let date = new Date("2021-04-26")
const now = new Date();

const data = [];

while (date <= now) {
    const until = new Date();
    until.setDate(date.getDate() + 6);
    const since = new Date(date);
    promises.push(new Promise((resolve, reject) => {
        registry.module("js-waku").totalDownloads({since, until}, function (err, downloads) {
            if (err) reject(err);

            const dateStr = new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(since);
            data.push({date: dateStr, "js-waku": downloads})
            resolve();
        })

    }))
    date.setDate(date.getDate() + 7);
}

Promise.all(promises).then(() => {
    const parser = new Parser();
    const csv = parser.parse(data);

    // write to a new file named 2pac.txt
    fs.writeFile('downloads.csv', csv, (err) => {
        if (err) throw err;
        console.log('Downloads saved to `./downloads.csv`')
    });
})







