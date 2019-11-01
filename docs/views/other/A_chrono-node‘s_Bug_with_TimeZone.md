---
title: A Chrone-node Bug with TimeZone
date: 2019-04-09
tags:
 - chrono
 - BUG
categories:
 - other
# publish: false
---

## What is Chrono-node
Chrono is A natural language date parser in Javascript, designed for extracting date information from any given text

you can find its document from [NPM](https://www.npmjs.com/package/chrono-node) and [GIT](https://github.com/berryboy/chrono.git)

## What is the probleam
### introduction
when use the chrono-node to parse the String with abbr of timezone like `'9 AM PST'`, the hour and year are right, but day wasn't always accurate. It not base on the day in PST, it base the day in local timezone.
### test case
In order to reproduce the above problems you can fist clone the chono-node and add the case into the test dir
1.  clone and Install dependencies
    ```sh
    git clone https://github.com/wanasit/chrono.git
    cd chrono
    npm install
    ```
2.  add flowing case into a file like `timezone.test.js` inner `./test`
    ```js
    var chrono = require('../../src/chrono');
    test("Test - Single Expression", function() {
        let results = chrono.parse('10 pst', new Date('June 02, 2019 PST 9:00'))
        expect(results.length).toBe(1)
        expect(results[0].start.date().valueOf()).toBe(new Date('June 02, 2019 PST 10:00').valueOf())
    })
    ```
3. run the test
    ```sh
    npm run watch
    or
    npm run test
    ```
4. you will find that the case you just added did not pass.
   ```sh
   Expected value to be:
      1559498400000
    Received:
      1559584800000

      3 |     let results = chrono.parse('10 pst', new Date('June 02, 2019 PST 9:00'))
      4 |     expect(results.length).toBe(1)
    > 5 |     expect(results[0].start.date().valueOf()).toBe(new Date('June 02, 2019 PST 10:00').valueOf())
      6 | })
    ```
    ::: warning
    if all of the cases were passed, maybe it's because the time zone of your device is similar to PST. You can try other time zones, or just change your device's timezone to 'ShangHai/China'
    :::
## Analysis of the reasons
### Code review
In `chrono-node/src` there are two folders , `Parser` and `Refiner`. Here are the descriptions of them.
> Parser is a module for low-level pattern-based parsing. Ideally, each parser should be designed to handle a single specific date format. User can add new type of parsers for supporting new date formats or languages.

> Refiner is a higher level module for improving or manipulating the results. User can add a new type of refiner to customize Chrono's results or to add some custom logic to Chrono.

In terms of the code running process, first get all matching results through `parser`, then further process the results through `refiner`

I fond one file of each folder related to this issue.
`/parsers/en/ENTimeExpressionParser.js`and`/src/refiners/ExtractTimezoneAbbrRefiner.js`
#### ENTimeExpressionParser.js
this file could format '10' into '10:00' witch means time parse is right. But for the date, chrone use [`Moment.js`](https://momentjs.com) to get the date such as day,month.years.
```js {2,9}
// code segment in ENTimeExpressionParser.js
var refMoment = moment(ref);
var result = new ParsedResult();
result.ref = ref;
result.index = match.index + match[1].length;
result.text  = match[0].substring(match[1].length);
result.tags['ENTimeExpressionParser'] = true;

result.start.imply('day',   refMoment.date());
result.start.imply('month', refMoment.month()+1);
result.start.imply('year',  refMoment.year());
```
#### ExtractTimezoneAbbrRefiner.js
this file only assign the timezone offset
```js
var timezoneOffset = timezones[timezoneAbbr];
if (!result.start.isCertain('timezoneOffset')) {
    result.start.assign('timezoneOffset', timezoneOffset);
}

if (result.end != null && !result.end.isCertain('timezoneOffset')) {
    result.end.assign('timezoneOffset', timezoneOffset);
}

result.text += match[0];
result.tags['ExtractTimezoneAbbrRefiner'] = true;
```
### Reason
The timezone Moment uses by default is the timezone set by your device. It will cause following problem

| input  | device time                | ref time                  | output                     | expect                     |
| ------ | -------------------------- | ------------------------- | -------------------------- | -------------------------- |
| 10 pst | 2019-06-03 01:00:00(utc+8) | 2019-06-02 9:00:00(utc-8) | 2019-06-03 10:00:00(utc-8) | 2019-06-02 10:00:00(utc-8) |

As you can see, the result is one more day than expected. It's caused by device time is one more day than destination time.

## How to fix it

Because the time parse is in parse part and time zone parse is in Refiner part. So it's hard to get timezone offset when parse time. To minimize code changes, it's better to fix is in `ExtractTimezoneAbbrRefiner.js`and`ExtractTimezoneOffsetRefiner.js`.

```js {4,5,6,11,12,13,19,20,21,24,25,26}
// ExtractTimezoneAbbrRefiner.js
if (!result.start.isCertain('timezoneOffset')) {
    result.start.assign('timezoneOffset', timezoneOffset);
    if (!JSON.stringify(result.tags).match(/DateAndTime/i)) {
        result.start.assign('day', day);
    }
}

if (result.end != null && !result.end.isCertain('timezoneOffset')) {
    result.end.assign('timezoneOffset', timezoneOffset);
    if (!JSON.stringify(result.tags).match(/DateAndTime/i)) {
        result.end.assign('day', day);
    }
}

// ExtractTimezoneOffsetRefiner.js
if (result.end != null) {
    result.end.assign('timezoneOffset', timezoneOffset);
    if (!JSON.stringify(result.tags).match(/DateAndTime/i)) {
        result.end.assign('day', day);
    }
}
result.start.assign('timezoneOffset', timezoneOffset);
if (!JSON.stringify(result.tags).match(/DateAndTime/i)) {
    result.start.assign('day', day);
}
```
the hight light lines are what you have to adding in.
add`if (!JSON.stringify(result.tags).match(/DateAndTime/i))` to avoid overridden date parse results.

