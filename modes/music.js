const { submodes } = require("../modes/constants");
const { COMMAND_MODE } = require("../commands/constants");
const { buildWrite, setRgb } = require("../shared/utils");

const setMusic = (parameters) => buildWrite([
    COMMAND_MODE, submodes.MODE_MUSIC_IC, ...parameters
]);

const buildMusic = (submode, sensitivity = 0) => [
    COMMAND_MODE, submodes.MODE_MUSIC_IC, submode, sensitivity & 0xFF
];

const setScroll = (red, green, blue, sensitivity) => setMusic([
    ...buildMusic(0x02, sensitivity),
    ...setRgb(red, green, blue)
]);

const setSpectrum = (red, green, blue, sensitivity) => setMusic([
    ...buildMusic(0x01, sensitivity),
    ...setRgb(red, green, blue)
]);

module.exports = {
    setScroll,
    setSpectrum,
    setMild: (sensitivity) => setMusic(buildMusic(0x04, sensitivity)),
    setEnergy: (sensitivity) => setMusic(buildMusic(0x00, sensitivity)),
    setRhythm: (sensitivity) => setMusic(buildMusic(0x03, sensitivity)),
    setDynamic: (sensitivity) => setMusic(buildMusic(0x05, sensitivity))
};