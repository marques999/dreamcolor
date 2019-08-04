const constants = require("./constants");
const { buildWrite } = require("../shared/utils");

module.exports = {
    getEnabled: () => buildRead([constants.COMMAND_SWITCH]),
    getCurrent: () => buildRead([constants.COMMAND_CURRENT]),
    getRedBlue: () => buildRead([constants.COMMAND_REDBLUE]),
    getVersion: () => buildRead([constants.COMMAND_VERSION]),
    getBrightness: () => buildRead([constants.COMMAND_BRIGHTNESS]),
    setInitialize: () => buildWrite([constants.COMMAND_INITIALIZE]),
    setCurrent: (current) => buildWrite([constants.COMMAND_CURRENT, current & 0xFF]),
    setEnabled: (enabled) => buildWrite([constants.COMMAND_SWITCH, Number(enabled)]),
    setRedBlue: (red, blue) => buildWrite([constants.COMMAND_REDBLUE, red & 0xFF, blue & 0xFF]),
    setBrightness: (brightness) => buildWrite([constants.COMMAND_BRIGHTNESS, brightness & 0xFF])
};