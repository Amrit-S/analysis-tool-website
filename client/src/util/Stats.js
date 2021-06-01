const math = require("mathjs");

const MAX_DECIMALS = 1;

function getMean(dataArr) {
    return math.mean(dataArr).toFixed(MAX_DECIMALS);
}

function getMin(dataArr) {
    return math.min(dataArr).toFixed(MAX_DECIMALS);
}

function getMax(dataArr) {
    return math.max(dataArr).toFixed(MAX_DECIMALS);
}

function getMedian(dataArr) {
    return math.median(dataArr).toFixed(MAX_DECIMALS);
}

function getSTD(dataArr) {
    return math.std(dataArr).toFixed(MAX_DECIMALS);
}

function getMovingAverage(dataArr) {
    let total = dataArr[0];
    let movingAvg = [total];

    for (let i = 1; i < dataArr.length; i++) {
        total += dataArr[i];
        movingAvg.push(total / (i + 1));
    }
    return movingAvg;
}

export { getMean, getMin, getMax, getMedian, getSTD, getMovingAverage };
