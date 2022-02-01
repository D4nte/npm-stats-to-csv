const registry = require('npm-stats')(["registry.npmjs.org"])
const {Parser} = require('json2csv');
const fs = require("fs");

let promises = []

let date = new Date("2021-05-04")
const now = new Date();

const data = {};

while (date <= now) {
    const until = new Date(date);
    until.setDate(until.getDate() + 6);
    const since = new Date(date);
    const dateStr = new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(since);

    data[dateStr] = {};

    promises.push(new Promise((resolve, reject) => {
        registry.module("js-waku").totalDownloads({since, until}, function (err, downloads) {
            if (err) reject(err);
            data[dateStr].jsWaku = downloads;
            resolve();
        })
    }))
    promises.push(new Promise((resolve, reject) => {
        registry.module("hashconnect").totalDownloads({since, until}, function (err, downloads) {
            if (err) reject(err);
            data[dateStr].hashconnect = downloads;
            resolve();
        })
    }))
    promises.push(new Promise((resolve, reject) => {
        registry.module("@walletconnect/core").totalDownloads({since, until}, function (err, downloads) {
            if (err) reject(err);
            data[dateStr].walletConnect = downloads;
            resolve();
        })
    }))

    date.setDate(date.getDate() + 7);
}

Promise.all(promises).then(() => {
    const array = []

    for (let key in data) {
        array.push({
            date: key,
            'js-waku': data[key].jsWaku,
            'wallet connect': data[key].walletConnect,
            'hashconnect': data[key].hashconnect
        })
    }

    const parser = new Parser();
    const csv = parser.parse(array);

    // write to a new file named 2pac.txt
    fs.writeFile('downloads.csv', csv, (err) => {
        if (err) throw err;
        console.log('Downloads saved to `./downloads.csv`')
    });
})







