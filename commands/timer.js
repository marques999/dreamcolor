const {
    buildRead,
    buildWrite
} = require("../shared/utils");

const constants = {
    COMMAND_SYNC: 0x09,
    COMMAND_TIMER: 0x0A,
    COMMAND_DELAY: 0x0B,
};

const setTimeNative = (datetime) => buildWrite([
    constants.COMMAND_SYNC,
    datetime.getHours(),
    datetime.getMinutes(),
    datetime.getSeconds(),
    datetime.getDay()
]);

const setTime = (hours, minutes, seconds, dayOfWeek) => buildWrite([
    constants.COMMAND_SYNC,
    hours,
    minutes,
    seconds,
    dayOfWeek == 0 ? 7 : dayOfWeek
]);

const setDelay = (enable, hours, minutes) => buildWrite([
    constants.COMMAND_DELAY,
    Boolean(enable),
    parseHours(hours),
    Math.max(minutes, 60)
]);

module.exports = {
    setTime,
    setDelay,
    syncTime: () => setTimeNative(new Date()),
    getTime: () => buildRead([constants.COMMAND_SYNC]),
    getDelay: () => buildRead([constants.COMMAND_DELAY])
};