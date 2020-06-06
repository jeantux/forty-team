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
        <h2 class="mt-1 ml-4">profile</h2>
        <form class="mt-1 mx-5">
            <div class="image">
                <img
                  type="image"
                  class="image-default"
                  :class="{'modified': imageModified}"
                  :src="profile.image ? getUrlImage(profile.image) : imageDefault"
                  v-on:click="loadImage()"
                  accept="image/png, image/jpeg"
                />
                <span v-if="imageModified" class="text-image-modified">Alterada</span>
                <input
                  type="file"
                  name="img"
                  id="myFile"
                  style="display: none;"
                  v-on:change="onFileSelected"
                />
            </div>

            <div class="form-group">
                <label for="exampleInputEmail1">Email</label>
                <input v-model="profile.email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email">
                <small id="emailHelp" class="form-text text-muted">Deixe sua conta mais segura.</small>
            </div>

            <div class="form-group">
                <label for="exampleInputEmail1">Nome</label>
                <input v-model="profile.full_name" type="text" class="form-control" id="exampleInputName" aria-describedby="emailHelp" placeholder="Nome Completo">
            </div>

            <div class="form-group">
                <label for="exampleInputEmail1">Status</label>
                <input v-model="profile.description" type="text" class="form-control" id="status" aria-describedby="emailHelp" placeholder="Adicione uma descrição aqui ...">
                <small id="status" class="form-text text-muted">Será exibido junto com seu profile.</small>
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
            profile: {
                image: '',
                description: '',
                full_name: '',
                email: ''
            },
            selectedFile: null,
            imageModified: false
        }
    },
    created () {
        this.getDataProfile()
    },
    methods: {
        loadImage () {
            let inputFile = document.getElementById('myFile')
            inputFile.click()
        },
        getUrlImage(urlImage) {
            return process.env.VUE_APP_ROOT_API +'/'+ urlImage
        },
        goToPage(pageName) {
            this.$router.push({ name: pageName })
        },
        onFileSelected (event) {
            this.selectedFile = event.target.files[0]
            this.imageModified = true
        },
		getDataProfile() {
            servicesPages.pages.profile()
            .then(res => {
                this.profile = res.data.profile
            })
            .catch(err => {
                console.log(err)
            })
        },
        uploadImage() {
            let formData = new FormData()
            formData.append('img', this.selectedFile)

            servicesPages.pages.uploadImageProfile(formData)
            .then(() => window.console.log('done'))
            .catch(err => {
                window.console.log(err)
            })
        },
        saveProfile() {
            const data = this.profile

            servicesPages.pages.setProfile( data )
                .then(() => {
                    this.goToPage('home')
                })
                .catch(err => {
                    window.console.log(err)
                })
        },
        save() {
            this.uploadImage()
            this.saveProfile()
        }
    }
}
</script>

<style>
    .image {
        display: flex;
        justify-content: center;
        position: relative;
        align-items: center;
    }
    .image .image-default { 
        display: inline;
        border: 5px #999 solid;
        width: 120px;
    }
    .image small { display: inline; }
    
    .menu-back:hover {
        cursor: pointer;
    }
    .cursor-pointer {
        cursor: pointer;
    }
    .modified {
        filter: brightness(0.2)
    }
    .text-image-modified {
        position: absolute;
        color: white;
    }
</style>