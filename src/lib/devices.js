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

/*?
const teltonikaDevices = () => {
    for (const model of ['001', '120', '130', '140', '920'])
}*/

export const deviceTypes = [
        {name: 'Concox', value: 'concox'},
        {name: 'Suntech ST310u', value:'ST300CMD'},
        {name: 'Aovx GL100', value: 'gl100'},
        {name: 'Aovx VL100', value: 'vl100'},
        {name: 'Teltonika FMB920', value: 'fmb920'},
    ].sort((a, b) => a.name.localeCompare(b.name))
