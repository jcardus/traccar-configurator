const host = 'gps.rastreosat.com.br'

const concox =  ({}, apn) => [
    `SERVER,0,${host},5023,0#`,
    `SERVER,1,${host},5023,0#`,
    `APN,${apn}#`
]

export const getData = (device, apn='allcom.vivo.com.br') => ({
    concox,
    teltonika: ({uniqueId}) => [
        `  setparam 2001:${apn}`,
        `  setparam 2004:${host};2005:5027`,
        `  flush ${uniqueId},${apn},,,${host},5027,0`,
    ],
    aovx: () => ['config aovx'],
    ST300CMD: ({model, uniqueId}) => [`${model};${uniqueId};02;0;${apn};allcom;allcom;${host};5011;;;;`],
}[device.model](device, apn))

export const deviceTypes = [
        {name: 'Concox', value: 'concox'},
        {name: 'Suntech ST310u', value:'ST300CMD'},
        {name: 'Aovx GL100', value: 'aovx'},
        {name: 'Aovx VL100', value: 'aovx'},
        {name: 'Teltonika', value: 'teltonika'}
    ].sort((a, b) => a.name.localeCompare(b.name))
