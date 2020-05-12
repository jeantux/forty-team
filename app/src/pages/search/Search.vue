<template>
  <div class="search-app">
    <link rel='stylesheet prefetch' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.2/css/font-awesome.min.css'>
    <nav class="navbar navbar-light bg-white mb-4 topbar">
        <a v-on:click="goToPage('home')" class="menu-back navbar-brand"><i class="fa fa-chevron-left"></i></a>
        <form class="form-inline">
            <div class="input-group input-search">
                <input
                  type="text"
                  placeholder="Digite o que procura"
                  v-model="textSearch"
                  v-on:keyup.enter="searchUser()"
                >
            </div>
		</form>
		<div class="navbar">
			<a v-on:click="signOut()" href="#">Sair</a>
		</div>
    </nav>

    <div class="container-fluid gedf-wrapper">
        <div class="row">
            <div class="col-md-9">
                <div class="card gedf-card" v-for="user in users" :key="user.name">
                    <div class="card-header bg-ligth-card">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="mr-2">
                                    <img class="rounded-circle" width="45" :src="user.image" alt="">
                                </div>
                                <div class="ml-2">
                                    <div class="h5 m-0">{{ user.name }}</div>
                                    <div class="h7 text-muted mb-2">{{ user.description }}</div>
                                    <div class="tag-friends text-center">Amigos</div>
                                </div>
                            </div>
                            <div>
                                <div class="dropdown">
                                    <a v-on:click="sendMessage(user)" class="card-link-active text-white"><i class="fa fa-paper-plane"></i></a>
                                </div>
                            </div>
                        </div>
        
                    </div>
                    <div v-if="false" class="card-body">       
                        <p class="card-text">                            
                            Extremamente leve e robusto, proporciona comodidade no transporte e estabilidade na hora do disparo da fotografia. O equipamento possui travas de elevação e de inclinação vertical, pernas retráteis com ajuste em 4 alturas e haste central com encaixe retrátil na base.
                            O tripé vem acompanhado de um adaptador para smartphone, que permitirá a gravação de momentos incríveis e com muita mobilidade.
                        </p>
                    </div>
                </div>
            </div>
    
            <div class="col-md-3" v-show="false">
                <div class="card gedf-card">
                    <div class="card-body lign-items-center">
                        <div class="card-body d-flex justify-content-between lign-items-center">
                            <div class="">
                                <img class="rounded-circle" width="45" src="images/icon-user-default.png" alt="">
                            </div>
                            <h5 class="card-title">Empresa teste</h5>
                        </div>
                        
                        <h6 class="card-subtitle mb-2 text-muted"></h6>
                        <p class="card-text">A melhores esfirras, entregamos em sua casa.</p>
                        <a href="#" class="card-link">Perfil</a>
                        <a href="#" class="card-link">Conversar</a>
                    </div>
                </div>

                <div class="card gedf-card">
                    <div class="card-body lign-items-center">
                        <div class="card-body d-flex justify-content-between lign-items-center">
                            <div class="">
                                <img class="rounded-circle-prop" width="45" src="images/icon-user-default.png" alt="">
                            </div>
                            <h5 class="card-title">Segunda empresa</h5>
                        </div>
                        
                        <h6 class="card-subtitle mb-2 text-muted"></h6>
                        <p class="card-text">A melhores esfirras, entregamos em sua casa.</p>
                        <a href="#" class="card-link">Perfil</a>
                        <a href="#" class="card-link">Conversar</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { servicesPages } from '@/http'
import { mapActions } from 'vuex'

export default {
    name: 'Search',
    data () {
        return {
            textSearch: '',
            users: {}
        }
    },
    created () {
        this.searchUser()
    },
    methods: {
    ...mapActions('auth', ['ActionSignOut']),
        signOut () {
        this.ActionSignOut()
        this.$router.push({ name: 'login' })
        },
        sendMessage(user) {
            window.console.log(user)
        },
        goToPage(pageName) {
            this.$router.push({ name: pageName })
        },
        searchUser () {
            servicesPages.pages.searchUsers({ textSearch: this.textSearch })
                .then(res => {
                    window.console.log(res.data)
                    this.users = res.data.users
                })
                .catch(err => {
                    window.console.log(err)
                })
        }
    }
}
</script>

<style>
button {border-radius: 5px; background-color: #3f5fc7;}
.bg-ligth-card{background: #ffffff !important;}
.input-search{border-radius: 5px !important; border: none; background: #f6f6fd; padding: 5px;}
.input-search input {border: none; width: 100%; background: transparent; padding-left: 10px;}
.input-search input:focus {border: none; outline: none;}
.topbar{box-shadow: #eee 1px 1px 2px 1px;}

.card-link {
    background: #e5e7fa;
    padding: 10px;
    border-radius: 5px;
    color: #3f5fc7;
    border: #eff5f7 1px solid;
}

.card-link-active {
    background: #3f5fc7;
    padding: 10px;
    border-radius: 5px !important;
    color: white;
    border: #3f5fc7 1px solid;
}
.card-link-active:hover { background: #2b4e8f; color: #fff; text-decoration: none;}
.card-link:hover { background: #3f5fc7; color: white;}
.tag-friends {
    background: #3f5fc7;
    color: #ffffff;
    border-radius: 5px;
    width: 50px;
    font-size: 12px;
    float: right;
    position: absolute;
    margin-top: -10px;
}
.menu-back:hover {
    cursor: pointer;
}
</style>