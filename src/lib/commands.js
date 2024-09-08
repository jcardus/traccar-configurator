const host = 'gps.rastreosat.com.br'

const Concox =  ({}, apn) => [
    `SERVER,0,${host},5023,0#`,
    `SERVER,1,${host},5023,0#`,
    `APN,${apn}#`
]

export const getData = (device, deviceType, apn='allcom.vivo.com.br') => ({
    Concox,
    Teltonika: ({uniqueId}) => [
        `  setparam 2001:${apn}`,
        `  setparam 2004:${host};2005:5027`,
        `  flush ${uniqueId},${apn},,,${host},5027,0`,
    ],
    Aovx: () => ['config aovx'],
    Suntech: ({model, uniqueId}) => [`${model};${uniqueId};02;0;${apn};allcom;allcom;${host};5011;;;;`],
}[deviceType](device, apn))

export const deviceTypes = ['Concox', 'Suntech', 'Aovx', 'Teltonika'].sort().map(d => ({name: d, value: d}))
