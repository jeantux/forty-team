import Vue from 'vue'

function toastSuccess(message = 'Sucesso!') {
    Vue.prototype.$toasted.show(message, {type: 'success', position: 'top-right'})
}

function toastError(message = 'Falha!') {
    Vue.prototype.$toasted.show(message, {type: 'error', position: 'top-right'})
}

export default { toastSuccess, toastError }