const preset = require("./preset");
const constants = require("./constants");

const generateCommand = (parameters) => Buffer.from([
    ...parameters,
    ...new Array(19 - parameters.length).fill(0),
    parameters.reduce((i, j) => i ^ j, 0)
]);

const OPCODE_READ = 0xAA;
const OPCODE_WRITE = 0x33;

const read = (peripheral, bytes) => {
    console.log(generateCommand([OPCODE_READ, ...bytes]));
    writeHandle(peripheral, 0x15,
        generateCommand([OPCODE_READ, ...bytes]));
};

const write = (peripheral, bytes) =>
    writeHandle(peripheral, 0x15,
        generateCommand([OPCODE_WRITE, ...bytes]));

const setEnabled = (enabled) => [
    constants.COMMAND_TOGGLE,
    Number(enabled)
];

const setBrightness = (brightness) => [
    constants.COMMAND_BRIGHTNESS,
    brightness & 0xFF
];

const setScene = (scene) => [
    constants.COMMAND_MODE, 
    constants.MODE_SCENE,
    scene & 0xFF
];

const setRhythm = () => [
    constants.COMMAND_MODE,
    constants.MODE_MUSIC,
    constants.MUSIC_RHYTHM
];

const setEnergetic = () => [
    constants.COMMAND_MODE,
    constants.MODE_MUSIC,
    MUSIC_ENERGETIC
];

const setClock = (datetime) => [
    constants.COMMAND_CLOCK,
    datetime.hour,
    datetime.minute,
    datetime.second
];

const setColor = (red, green, blue) => [
    constants.COMMAND_MODE,
    constants.MODE_STATIC,
    red & 0xFF,
    green & 0xFF,
    blue & 0xFF
];

const setSpectrum = (red, green, blue) => [
    constants.COMMAND_MODE,
    constants.MODE_MUSIC,
    constants.MUSIC_SPECTRUM,
    0x00,
    red & 0xFF,
    green & 0xFF,
    blue & 0xFF
];

function setPreset(effect, zone, speed, colors) {
	generateCommand([COMMAND_MODE, MODE_PRESET, 0x12]);
    preset.generatePreset(effect, zone, speed, colors).forEach(generateCommand);
}

const noble = require("noble");
const dreamcolorUuid = "a4:c1:38:ae:b0:63";

noble.on("stateChange", state => {
    console.log("stateChange", state);
    if (state === "poweredOn") {
      noble.startScanning([], false);
    }
    else {
      noble.stopScanning();
    }
});

const getServices = async(peripheral, servicesUuid = []) => 
    new Promise((resolve, reject) => peripheral.discoverSomeServicesAndCharacteristics(servicesUuid, [],
        (error, services) => error ? reject(error) : resolve(services)));

const connect = async(peripheral) =>
    new Promise((resolve, reject) => peripheral.connect(
        (error) => error ? reject(error) : resolve()));

const writeHandle = async(peripheral, handle, bytes) =>
    new Promise((resolve, reject) => peripheral.writeHandle(
        handle, bytes, true,
        (error) => error ? reject(error) : resolve()));

const getServiceByUuid = async(peripheral, serviceUuid) => 
    (await getServices(peripheral, [serviceUuid]))[0] || {};

const characteristicUuid = "000102030405060708090a0b0c0d1910";
const characteristicResetUuid = "000102030405060708090a0b0c0d1912";

async function getNotificationsCharacteristic(peripheral) {
    const { characteristics } = await getServiceByUuid(peripheral, characteristicUuid);
    return characteristics.find(({ properties }) => properties.includes("notify"));
}

async function getResetCharacteristic(peripheral) {
    const { characteristics } = await getServiceByUuid(peripheral, characteristicResetUuid);
    return characteristics.find(({ properties }) => properties.includes("writeWithoutResponse"));  
}
const enableNotificationns = (peripheral) => 
    writeHandle(peripheral, 0x12, Buffer.from([0x00, 0x01]));

const subscribeNotifications = (characteristic) => 
    new Promise((resolve, reject) => characteristic.subscribe(
        (error) => error ? reject(error) : resolve()));

noble.on("discover", async peripheral => {
    
    if (peripheral.address != dreamcolorUuid) {
        return;
    }
    
    noble.stopScanning();

    await connect(peripheral);

    const notificationCharacteristic = await getNotificationsCharacteristic(peripheral);

    await enableNotificationns(peripheral);
    await subscribeNotifications(notificationCharacteristic);

    notificationCharacteristic.on('data', (data, isNotification) => {
        console.log(data, isNotification);
    });
    
    await read(peripheral, [constants.COMMAND_VERSION]);
  
    // //service.discoverCharacteristics([], characteristics => console.log(characteristics));

    // const resetCharacteristic = await getResetCharacteristic(peripheral);
    // write(resetCharacteristic,[1]);
});

const decodeAscii = (array) => String.fromCharCode(...array);
const getVersion = () => decodeAscii(read([COMMAND_VERSION]).slice(2, -2));

module.exports = [
    setEnabled,
    setBrightness,
    setScene,
    setRhythm,
    setEnergetic,
    setClock,
    setColor,
    setSpectrum,
    setPreset
];