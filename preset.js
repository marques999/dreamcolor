const MAXIMUM_LENGTH = 19;
const PARAMETERS_LENGTH = 11;

const hexify = (bytes) => bytes
    .map(value => ("0" + (value & 0xFF).toString(16)).slice(-2))
    .join(String());

const calculateXor = (parameters) => parameters.reduce((i, j) => i ^ j, 0);
const generateCommand = (parameters) => generateBaseCommand([0xA1, 0x02, ...parameters]);

const generateBaseCommand = (parameters) => [
    ...parameters,
    ...new Array(MAXIMUM_LENGTH - parameters.length).fill(0),
    calculateXor(parameters)
];

function chunkify(collection, start, length) {    
    const end = start + Math.min(collection.length, length);
    return [collection.slice(start, end), collection.slice(end)];
}

function generatePreset(effect, zone, speed, colors) {

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

    return commands.map(generateCommand).map(hexify);
}

module.exports = { generatePreset };