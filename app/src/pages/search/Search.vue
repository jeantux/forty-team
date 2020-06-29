<template>
  <div class="search-app">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <nav class="navbar navbar-light bg-white mb-4">
        <i v-on:click="goToPage('home')" class="btn-back material-icons">arrow_back</i>
        <div class="input-search-nav">
            <form class="form-inline d-flex justify-content-center">
                <div class="input-group input-search">
                    <input
                    type="text"
                    placeholder="Digite o que procura"
                    v-model="textSearch"
                    v-on:keyup.enter="searchUser()"
                    >
                </div>
            </form>
        </div>
    </nav>

    <div class="search">
        <div class=" list-users container-fluid gedf-wrapper">
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
                                        
                                    </div>
                                </div>
                                <div>
                                    <div class="dropdown">       
                                        <i v-show="user.mycontact" class="text-success material-icons schedule">check</i>
                                        <i v-show="user.invitepending" class="text-warning material-icons check">schedule</i>
                                        <a v-show="!user.mycontact && !user.invitepending" v-on:click="addUser(user)" class="card-link-active text-primary cursor-pointer"><i class="add material-icons">add</i></a>
                                    </div>
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
.bg-ligth-card{background: #ffffff}
.input-search{border-radius: 5px; border: none; background: #f6f6fd; padding: 5px;}
.input-search input {border: none; width: 100%; background: transparent; padding-left: 10px;}
.input-search input:focus {border: none; outline: none;}
.topbar{box-shadow: #eee 1px 1px 2px 1px;}

.btn-back {
    width: 5%;
    cursor: pointer;
}

.input-search-nav {
    width: 95%;
}

.search {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}

.list-users {
    width: 800px;
}

.card-link {
    background: #e5e7fa;
    padding: 10px;
    border-radius: 5px;
    color: red;
    border: #eff5f7 1px solid;
}

.card-link-active {
    padding: 10px;
}

.schedule{padding: 10px; font-size:20px}
.check{padding: 10px; font-size:20px}
.add{font-size:20px}
.add:hover{color:red}
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