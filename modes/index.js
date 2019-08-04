const { submodes } = require("../modes/constants");
const { COMMAND_MODE } = require("../commands/constants");
const { buildRead, buildWrite, setRgb } = require("../shared/utils");

const setColor = (redA, greenA, blueA, flag = false, redB = 0, greenB = 0, blueB = 0) => buildWrite([
    COMMAND_MODE,
    submodes.MODE_COLOR,
    ...setRgb(redA, greenA, blueA),
    flag,
    ...setRgb(redB, greenB, blueB)
]);

module.exports = {
    setColor,
    getMode: () => buildRead([COMMAND_MODE]),
    setScene: (scene) => buildWrite([COMMAND_MODE, submodes.MODE_SCENE, scene & 0xFF]),
    setMicrophone: (toggle, red, green, blue) => buildWrite([COMMAND_MODE, submodes.MODE_MICROPHONE, toggle, ...setRgb(red, green, blue)])
};