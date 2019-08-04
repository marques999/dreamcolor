const { submodes } = require("../modes/constants");
const { COMMAND_MODE } = require("../commands/constants");
const { buildWrite, buildWriteBuffered } = require("../shared/utils");

function chunkify(collection, start, length) {    
    const end = start + Math.min(collection.length, length);
    return [collection.slice(start, end), collection.slice(end)];
}

const PARAMETERS_LENGTH = 11;

function buildDiy(effect, zone, speed, colors) {

    const commands = [];
    const colorsBytes = colors.flat();
    const totalColors = colorsBytes.length;

    let totalLength = 1;

    if (totalColors > PARAMETERS_LENGTH) {
        totalLength += Math.ceil((totalColors - PARAMETERS_LENGTH) / 16);
    }

    commands.push([commands.length, totalLength]);
    
    let [current, remaining] = chunkify(colorsBytes, 0, PARAMETERS_LENGTH);
    
    commands.push([commands.length, 0x12, effect, zone, speed, totalColors, ...current]);

    for (let position = 2; position <= totalLength; position++) {
        [current, remaining] = chunkify(remaining, 0, 16);
        commands.push([position, ...current]);
    }

    commands.push([0xFF]);

    return commands;
}

module.exports = { 
    buildDiy,
    setDiy: () => buildWrite([COMMAND_MODE, submodes.MODE_DIY]),
    setDiyParameters: (parameters) => buildWriteBuffered([0x02, ...parameters])
};