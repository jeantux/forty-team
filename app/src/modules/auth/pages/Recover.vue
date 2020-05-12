<script>
  import { servicesAuth } from '@/http'
  export default {
      name: 'Recover',
      components: {},
      data () {
          return {
              form: {
                  email: ''
              },
              sending: {
                  status: false,
                  message: '',
                  color: 'green'
              }
          }
      },
      methods: {
          sendData () {
              servicesAuth.auth.recover(this.form)
              .then(() => {
                  this.sending.status = true
                  this.sending.message = 'Os dados para recuperação de sua conta foi enviado no e-mail: ' + this.form.email
                  this.sending.color = 'green'
              })
              .catch((res) => {
                  this.sending.status = true
                  this.sending.message = res.body.message === undefined ? 'Falha ao enviar os dados' : res.body.message
                  this.sending.color = 'red'
              })
          }
      }
  }
</script>

<template>
  <div class="recover-main">
    <div class="margin-top-bar">
      <nav class="navbar navbar-expand navbar-secondary bg-light static-top fixed-top">
        <router-link class="navbar-brand mr-1 text-blue-dt"  to="/">Voltar</router-link>
      </nav>
    </div>  

    <div class="bg-body bg-img-dt bg-default-dt mt-1">
        <div class="container margin-top">
        <div class="card card-login mx-auto mt-5">
            <div class="text-center mt-3">
            <img src="" class="logo-dom" alt="">
                <div class="card-body">
                    <p v-if="this.sending.status === false">Informe o e-mail cadastrado para receber a nova senha de acesso!</p>
                    <p v-if="this.sending.status">{{ this.sending.message }}!</p>
                </div>
            </div>
            
            <div class="card-body" v-if="this.sending.status === false">
            <form @submit.prevent="sendData()">
                <div class="form-group">
                    <input
                        type="email"
                        id="inputEmail"
                        class="form-control"
                        placeholder="Email"
                        required="required"
                        v-model="form.email"
                    />
                </div>
                <button class="btn bg-blue-dt btn-block">Enviar</button>
            </form>
            </div>
        </div>
        </div>
    </div>
</div>
</template>

<style scoped>
  .logo-dom{width: 80%;}
  .margin-top{margin-top: 100px}
  .bg-img-dt{background-size: cover;}
  .bg-body{width: 100vw; height: 100vh; position: absolute;}
</style>