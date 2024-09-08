const host = 'gps.rastreosat.com.br'
export const getData = (device, deviceType, apn='allcom.vivo.com.br') => ({
    Teltonika: ({uniqueId}) => [
        `  setparam 2001:${apn}`,
        `  setparam 2004:${host};2005:5027`,
        `  flush ${uniqueId},${apn},,,${host},5027,0`,
    ],
    Aovx: () => ['config aovx'],
    Suntech: ({model, uniqueId}) => [`${model};${uniqueId};02;0;${apn};allcom;allcom;${host};5011;;;;`],
}[deviceType](device))

export const deviceTypes = ['Suntech', 'Aovx', 'Teltonika'].sort().map(d => ({name: d, value: d}))
