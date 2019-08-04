const buildComand = (parameters) => Buffer.from([
    ...parameters,
    ...new Array(19 - parameters.length).fill(0),
    parameters.reduce((i, j) => i ^ j, 0)
]);

module.exports = {
    buildRead: (bytes) => buildComand([0xAA, ...bytes]),
    buildWrite: (bytes) => buildComand([0x33, ...bytes]),
    buildWriteBuffered: (bytes) => buildComand([0xA1, ...bytes]),
    decodeVersion = () => String.fromCharCode(...bytes.slice(2, -2)),
    setRgb: (red, green, blue) => [red & 0xFF, green & 0xFF, blue & 0xFF],
    hexify: (bytes) => bytes.map(value => ("0" + (value & 0xFF).toString(16)).slice(-2)).join(String())
};