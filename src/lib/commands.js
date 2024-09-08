export const getData = (device, deviceType, apn) => ({
    Teltonika: () => [`  setparam 2001:${apn};2004:gps.rastreosat.com.br;2005:5027`],
    Aovx: () => ['config aovx'],
    Suntech: ({model, uniqueId}) => [`${model};${uniqueId};02;0;${apn || 'allcom.vivo.com.br'};allcom;allcom;gps.rastreosat.com.br;5011;;;;`],
}[deviceType](device))

export const deviceTypes = ['Suntech', 'Aovx', 'Teltonika'].sort().map(d => ({name: d, value: d}))
