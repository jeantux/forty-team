<template>
    <div class="config">
        <link rel='stylesheet prefetch' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.2/css/font-awesome.min.css'>
        <nav class="navbar navbar-light bg-white mb-4 topbar">
            <a v-on:click="goToPage('home')" class="menu-back navbar-brand hover"><i class="fa fa-chevron-left"></i></a>
            <div class="navbar">
                <a v-on:click="signOut()" href="#">Sair</a>
            </div>
        </nav>

        <h1 class="mt-1 ml-3"> Configurações </h1>
        <h2 class="mt-1 ml-4">Perfil</h2>
        <form class="mt-1 mx-5">
            <div class="image">
                <img
                  type="image"
                  class="image-default"
                  :src="perfil.image ? perfil.image : imageDefault"
                  v-on:click="loadImage()"
                />
                <input
                  type="file"
                  id="myFile"
                  style="display: none;"
                  v-on:change="onFileSelected"
                />
            </div>

            <div class="form-group">
                <label for="exampleInputEmail1">Email</label>
                <input v-bind="perfil.email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email">
                <small id="emailHelp" class="form-text text-muted">Deixe sua conta mais segura.</small>
            </div>

            <div class="form-group">
                <label for="exampleInputEmail1">Nome</label>
                <input v-bind="perfil.name" type="text" class="form-control" id="exampleInputName" aria-describedby="emailHelp" placeholder="Nome Completo">
            </div>

            <div class="form-group">
                <label for="exampleInputEmail1">Status</label>
                <input v-bind="perfil.status" type="text" class="form-control" id="status" aria-describedby="emailHelp" placeholder="Adicione uma descrição aqui ...">
                <small id="status" class="form-text text-muted">Será exibido junto com seu perfil.</small>
            </div>

            <button v-on:click="save" class="btn btn-primary">Salvar</button>
        </form>

    </div>
</template>

<script>
import { servicesPages } from '@/http'
export default {
    name: 'Config',
    data () {
        return {
            imageDefault: 'images/icon-user-default.png',
            perfil: {
                image: '',
                status: '',
                name: '',
                email: ''
            },
            selectFile: null
        }
    },
    created () {
    },
    methods: {
        loadImage () {
            let inputFile = document.getElementById('myFile')
            inputFile.click()
        },
        goToPage(pageName) {
            this.$router.push({ name: pageName })
        },
        onFileSelected (event) {
            this.selectFile = event.target.files[0]
        },
        save () {
            const data = this.perfil
            servicesPages.pages.config( data )
                .then(() => {
                    this.goToPage('home')
                })
                .catch(err => {
                    window.console.log(err)
                })
        }
    }
}
</script>

<style>
    .image {text-align: center;}
    .image .image-default { 
        display: inline;
        border: 5px #999 solid;
        width: 120px;
    }
    .image small { display: inline; }
</style>