const host = 'gps.rastreosat.com.br'

const concox =  ({}, apn) => [
    `SERVER,0,${host},5023,0#`,
    `SERVER,1,${host},5023,0#`,
    `APN,${apn}#`
]

const teltonika = ({uniqueId}, apn) => [
    `  setparam 2001:${apn}`,
    `  setparam 2004:${host};2005:5027;50190:2;50191:5`,
    `  flush ${uniqueId},${apn},,,${host},5027,0`,
]

const messages = {
    huabao: ({attributes}) => ['IP=0,gps.rastreosat.com.br,5015', `APN=${attributes.apn}`],
    concox,
    teltonika,
    fmb920: teltonika,
    GL100: () => ['config aovx'],
    ST300CMD: ({model, uniqueId}) => [`${model};${uniqueId};02;0;${apn};allcom;allcom;${host};5011;;;;`],
}

export const getData = (device) => {
    if (!messages[getProtocol(device.model)]) {
        return []
    }
    return messages[getProtocol(device.model)](device)
}

function getProtocol(model) {
    return devices.find(d => d.Device === model).Protocol
}

import devices from './devices.json'

export const deviceTypes = devices.map(d => ({name: `${d.Device} (${d.Brand || d.Protocol})`, value: d.Device}))
    .sort((a, b) => a.name.localeCompare(b.name))
