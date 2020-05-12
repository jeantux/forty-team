function maskCpf(value) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"$1.$2.$3-$4")
}

function maskCnpj(value) {
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"$1.$2.$3/$4-$5")
}

function maskCpfCnpj(value) {
    let newValue = value

    if (value)
        newValue = value['length'] <= 11 ? maskCpf(value) : maskCnpj(value)

    return newValue
}

function maskReal(numero) {
    var num = numero.toFixed(2).split('.')
    num[0] = 'R$ ' + num[0].split(/(?=(?:...)*$)/).join('.')
    return num.join(',')
  }

export default { maskCpfCnpj, maskReal}