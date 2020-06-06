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
            <div class="col">
                <div class="card gedf-card" v-for="user in users" :key="user.name">
                    <div class="card-header bg-ligth-card">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="mr-2">
                                    <img class="rounded-circle" width="45" :src="user.image ? getUrlImage(user.image) : 'images/icon-user-default.png'" alt="">
                                </div>
                                <div class="ml-2">
                                    <div class="h5 m-0">{{ user.name }}</div>
                                    <div class="h7 text-muted mb-2">{{ user.description }}</div>
                                    <div v-show="user.mycontact" class="tag-friends text-center">Amigos</div>
                                    <div v-show="user.invitepending" class="tag-pending text-center">Pendente</div>
                                </div>
                            </div>
                            <div>
                                <div class="dropdown">       
                                    <a v-show="!user.mycontact && !user.invitepending" v-on:click="addUser(user)" class="card-link-active text-white cursor-pointer"><i class="fa fa-user-plus"></i></a>
                                </div>
                            </div>
                        </div>
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
import * as storage from '@/modules/auth/storage'
import io from 'socket.io-client'

export default {
    name: 'Search',
    data () {
        return {
            textSearch: '',
            users: {},
            socket: io(process.env.VUE_APP_ROOT_API)
        }
    },
    created () {
        this.authenticateUser()
        this.searchUser()
    },
    methods: {
    ...mapActions('auth', ['ActionSignOut']),
        signOut () {
            this.ActionSignOut()
            this.$router.push({ name: 'login' })
        },
        getUrlImage(urlImage) {
            return process.env.VUE_APP_ROOT_API +'/'+ urlImage
        },
        authenticateUser() {
            const dataAuth = {
                token: 'Bearer ' + storage.getLocalToken()
            }
            this.socket.emit('authenticate', dataAuth);
        },
        addUser(user) {
            const token = 'Bearer ' + storage.getLocalToken()
            const actionClient = {
                id_contact: user.id_contact,
                message: '',
                token: token,
                actionType: 'adduser'
            }
            
            this.socket.emit('actionClient', actionClient)
            user.invitepending = true
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
    background: #009238;
    color: #ffffff;
    border-radius: 5px;
    width: 60px;
    font-size: 10px;
    float: right;
    position: absolute;
    margin-top: -10px;
}

.tag-pending {
    background: #b48d0c;
    color: #ffffff;
    border-radius: 5px;
    width: 60px;
    font-size: 10px;
    float: right;
    position: absolute;
    margin-top: -10px;
}
.menu-back:hover {
    cursor: pointer;
}
.cursor-pointer {
    cursor: pointer;
}
</style>