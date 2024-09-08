export const getData = (device, deviceType, apn) => ({
    Aovx: () => ['config aovx'],
    Suntech: ({model, uniqueId}) => [`${model};${uniqueId};02;0;${apn || 'allcom.vivo.com.br'};allcom;allcom;gps.rastreosat.com.br;5011;;;;`],
}[deviceType](device))
