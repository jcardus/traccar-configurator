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
    concox,
    teltonika,
    fmb920: teltonika,
    gl100: () => ['config aovx'],
    ST300CMD: ({model, uniqueId}) => [`${model};${uniqueId};02;0;${apn};allcom;allcom;${host};5011;;;;`],
}

export const getData = (device, apn='allcom.vivo.com.br') => {
    if (!messages[device.model]) {
        alert('invalid device model ' + device.model);
        return
    }
    return messages[device.model](device, apn)
}

import devices from './devices.json'

export const deviceTypes = devices.map(d => ({name: d.Device + ` (${d.Protocol})`, value: d.Device}))
    .sort((a, b) => a.name.localeCompare(b.name))
