<template>
  <div class="row">
    <div class="col-md-6">
      <div class="login-form">
        <div class="avatar" v-if="!activeLoading">
          <img src="@/assets/img/chat-logo.png" alt="Avatar">
        </div>
        <form @submit.prevent="register()" v-if="!activeLoading">
          <div class="form-group">
            <dt for="">Usuário</dt>
            <input type="text" class="form-control" v-model="form.username" required="required">
          </div>
          <div class="form-group">
            <dt for="">Senha</dt>
            <input type="password" class="form-control" v-model="form.password" required="required">
          </div>
          <div class="form-group">
            <dt for="">Confirmação de Senha</dt>
            <input type="password" class="form-control" v-model="form.confirmPassword" required="required">
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-lg btn-block">Cadastrar</button>
          </div>
          <div class="clearfix">
            <a class="pull-right">Já é registrado?</a>
            <a id = "entrar"><router-link to="login">Entrar</router-link></a>
          </div>
        </form>

        <loading-app
          v-bind:visibility="activeLoading"
        />
      </div>
    </div>
    <div class="banner col-md-6">
      <img class="img-lateral" src="@/assets/img/astronauta.svg" alt="" srcset="">
    </div>
  </div>
</template>

<script>
import { servicesAuth } from '@/http'
import toast from '@/methods/toast'
import loadingApp from '@/components/loading-app/loading-app.vue'

export default {
  data: () => ({
    activeLoading: false,
    form: {
      username: '',
      password: '',
      confirmPassword: ''
    }
  }),
  components: {
      loadingApp
  },
  created () {
  },
  methods: {
    validations () {
      if (!this.form.username.trim()) {
        toast.toastError('O usuário é obrigatório!')
        return false
      } 
      else if (this.form.password !== this.form.confirmPassword) {
        toast.toastError('As Senhas são incompatíveis!')
        return false
      } if (!this.form.username.indexOf(' ') > -1) {
        toast.toastError('O usuário não pode possuir espaços em branco!')
        return false
      } else {
        return true
      }
    },
    register () {
      if(this.validations()) {
        this.activeLoading = true
        servicesAuth.auth.register({username: this.form.username, password: this.form.password})
          .then(() => {
            this.$router.push({ name: 'login' })
          })
          .catch(err => {
            toast.toastError(err.data ? err.data.message : 'Oops... Ocorreu um erro!')
            this.activeLoading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  body {
    color: #fff;
    background: #2b3137 !important;
  }

  dt {color: #000}

  #entrar a {
    color: #e05402 !important; 
    margin-left: 4px;
  }

  .form-control {
    min-height: 41px;
    box-shadow: none !important;
  }

  .form-control:focus {
    border-color: #afafaf;
  }

  .form-control,
  .btn {
    border-radius: 2px;
  }

  .login-form {
    width: 350px;
    margin: 0 auto;
    padding: 10px 0 30px;
  }

  .login-form form {
    color: #7a7a7a;
    border-radius: 2px;
    margin-bottom: 15px;
    font-size: 13px;
    background: #fff;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    padding: 30px;
    position: relative;
  }

  .login-form h2 {
    font-size: 22px;
    margin: 35px 0 25px;
  }

  .login-form .avatar {
    margin: 0 auto;
    left: 0;
    right: 0;
    width: 150px;
    height: 150px;
    z-index: 9;
    padding: 15px;
  }

  .login-form .avatar img {
    width: 100%;
  }

  .login-form input[type="checkbox"] {
    margin-top: 2px;
  }

  .btn-primary {background: #3f5fc7;}
  .btn-secondary {background: #818696;}

  .login-form .btn {
    font-size: 16px;
    font-weight: bold;
    border: none;
    margin-bottom: 20px;
  }

  .login-form .btn:hover,
  .login-form .btn:focus {
    background: #2b4e8f;
    outline: none !important;
  }

  .login-form a {
    color: #fff;
    text-decoration: underline;
  }

  .login-form a:hover {
    text-decoration: none;
  }

  .login-form form a {
    color: #7a7a7a;
    text-decoration: none;
  }
  .router-link {color: #3f5fc7;}

  .banner h1 {
    font-size: 4em;
    color: #000;
  }

  .banner h2 {
    font-size: 2em;
    color: #888;
  }

  .img-lateral {
    width: 60vh;
    margin: 0 auto;
  }

  .banner {
    margin-top: 130px;
  }

  .banner img {
    animation: balance 8s ease-in-out infinite alternate;
    will-change: transform;
  }

@keyframes balance {
  0% {
    transform: rotate3d(0, 1, 1, 6deg);
  }
  50% {
    transform: rotate3d(0, 1, 1, -6deg);
  }
  100% {
    transform: rotate3d(0, 1, 1, 6deg);
  }
}

@media (max-width: 900px) {
  .banner {
    display: none;
  }
}

</style>
