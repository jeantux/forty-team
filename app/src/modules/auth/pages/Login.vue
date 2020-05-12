<template>
<div class="login-form">
  <div class="avatar" v-if="!activeLoading">
    <img src="@/assets/img/chat-logo.png" alt="Avatar">
  </div>
  <form @submit.prevent="onSubmit()" v-if="!activeLoading">
    <div class="form-group">
      <dt for="">Usuário</dt>
      <input type="text" class="form-control" v-model="form.username" required="required">
    </div>
    <div class="form-group">
      <dt for="">Senha</dt>
      <input type="password" class="form-control" v-model="form.password" required="required">
    </div>
    <div class="form-group">
      <button type="submit" class="btn btn-primary btn-lg btn-block">Entrar</button>
    </div>
    <div class="clearfix">
      <a href="#" class="pull-right">Esqueceu a senha?</a>
      <a id = "cadastre-se"><router-link to="register">Cadastre-se</router-link></a>
    </div>
  </form>

  <loading-app
    v-bind:visibility="activeLoading"
  />
</div>
</template>

<script>
import { mapActions } from 'vuex'
import toast from '@/methods/toast'
import loadingApp from '@/components/loading-app/loading-app.vue'

export default {
  data: () => ({
    activeLoading: false,
    form: {
      username: '',
      password: ''
    }
  }),
  components: {
      loadingApp
  },
  created () {
  },
  methods: {
    ...mapActions('auth', ['ActionDoLogin']),
    async onSubmit () {
      try {
        this.activeLoading = true
        await this.ActionDoLogin(this.form)
        this.activeLoading = false
        this.$router.push({ name: 'home' })
      } catch (err) {
        toast.toastError(err.data ? err.data.message : 'Oops... Ocorreu um erro!')
        this.activeLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  color: #fff;
  background: #9276d4;
}

dt {color: #000}

#cadastre-se a {
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

.login-form form a:hover {
  text-decoration: underline;
}

</style>
