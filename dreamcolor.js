const noble = require("noble");
const music = require("./modes/music");

const dreamcolorUuid = "a4:c1:38:ae:b0:63";
const send = (peripheral, command) => writeHandle(peripheral, 0x15, command);

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

function enableNotificationns(peripheral) {
    return writeHandle(peripheral, 0x12, Buffer.from([0x00, 0x01]));
}

const subscribeNotifications = (characteristic) => 
    new Promise((resolve, reject) => characteristic.subscribe(
        (error) => error ? reject(error) : resolve()));

noble.on("discover", async peripheral => {
    
    if (peripheral.address != dreamcolorUuid) {
        return;
    }
    
    noble.stopScanning();

    await connect(peripheral);

    // const notificationCharacteristic = await getNotificationsCharacteristic(peripheral);

    // await enableNotificationns(peripheral);
    // await subscribeNotifications(notificationCharacteristic);

    // notificationCharacteristic.on('data', (data, isNotification) => {
    //     console.log(data, isNotification);
    // });
    
    // await read(peripheral, [constants.COMMAND_VERSION]);
  
    // //service.discoverCharacteristics([], characteristics => console.log(characteristics));
    send(peripheral, music.setEnergy());
    // const resetCharacteristic = await getResetCharacteristic(peripheral);
    // write(resetCharacteristic,[1]);
});