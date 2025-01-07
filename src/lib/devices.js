const host = 'gps.rastreosat.com.br'
const ip = '178.156.132.140'

const gt06 =  ({attributes}, port) => [
    `SERVER,0,${ip},${port},0#`,
    `SERVER,1,${host},${port},0#`,
    `APN,${attributes.apn}#`
]

const topin =  ({attributes}, port) => [
    `DOMAIN#${host}#${port}#`,
    `SERVER#${ip}#${port}#`,
    `APN#${attributes.apn}#`
]

const easytrack = ({attributes}) => [
    'REG000000#',
    'SMS1',
    `APN*${attributes.apn}`,
    `DNS#${host}#5056#`,
]

const teltonika = ({uniqueId}, apn) => [
    `  setparam 2001:${apn}`,
    `  setparam 2004:${host};2005:5027;50190:2;50191:5`,
    `  flush ${uniqueId},${apn},,,${host},5027,0`,
]

const messages = {
    huabao: ({attributes}) => ['IP=0,gps.rastreosat.com.br,5015', `APN=${attributes.apn}`],
    easytrack,
    gt06,
    topin,
    teltonika,
    suntech: ({model, uniqueId}) => [`${model};${uniqueId};02;0;${apn};allcom;allcom;${host};5011;;;;`],
}

export const getData = (device) => {
    if (!messages[getProtocol(device.model)]) {
        return []
    }
    return messages[getProtocol(device.model)](device, getPort(device.model))
}

function getProtocol(model) {
    const device = devices.find(d => d.Device === model)
    if (device) {
        return device.SmsProtocol || device.Protocol
    }
}

function getPort(model) {
    const device = devices.find(d => d.Device === model)
    return device && device.Port
}

import devices from './devices.json'

export const deviceTypes = devices.map(d => ({name: `${d.Device} (${d.Brand || d.Protocol})`, value: d.Device}))
    .sort((a, b) => a.name.localeCompare(b.name))
