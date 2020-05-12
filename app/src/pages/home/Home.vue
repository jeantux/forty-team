<script>
  import { mapState } from 'vuex'
  import { servicesPages } from '@/http'
  import * as storage from '@/modules/auth/storage'
  import io from 'socket.io-client'
  import { mapActions } from 'vuex'

export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      currentState: {
        message: '',
        contact: {}
      },
      contacts: [],
      profile: {},
      socket: io('localhost:3000')
    }
  },
	created() {
		this.getContacts()
    this.getDataProfile()
    this.authenticateUser()
    this.socketsEvents()
	},
	methods: {
    ...mapActions('auth', ['ActionSignOut']),
    signOut () {
      this.ActionSignOut()
      this.$router.push({ name: 'login' })
    },
    goToPage(pageName) {
        this.$router.push({ name: pageName })
    },
    clearTextarea(){
      this.$refs.emoji.clear()
    }, 
    scrollEnd() {
      setTimeout(function() {
        document.querySelector(".messages").scrollTop = document.querySelector(".messages").scrollHeight !== null ? document.querySelector(".messages").scrollHeight : 0
      })
    },
    socketsEvents() {
      this.socket.on('messages', data => {
        for (const key in this.contacts) {
            const currentContact = this.contacts[key]
            if ((currentContact !== undefined) && (data.id_contact === currentContact.id_contact)) {
              if (currentContact.talks.length) {
                currentContact.talks.push({method: 'replies', message: data.message})
              } else {  
                this.getMessages(currentContact, () => {
                  currentContact.talks.push({method: 'replies', message: data.message})
                })
              }
              if (this.currentState.contact.id_contact === currentContact.id_contact) {
                this.scrollEnd()
              } else {
                currentContact.notification = true
              }
            } else {
              window.console.log('add new user')
            }
        }
      })

      this.socket.on('typing', data => {
        for (const key in this.contacts) {
            const currentContact = this.contacts[key]
            if ((currentContact !== undefined) && (data.id_contact === currentContact.id_contact)) {
              if (this.currentState.contact.id_contact === currentContact.id_contact) {
                this.currentState.contact.typing = data.typing
              } 
              setTimeout(() => { this.currentState.contact.typing = false }, 3000)
            }
        }
        window.console.log(this.currentState.contact.typing)
      })

      this.socket.on('connect', () => {
        this.authenticateUser()
      })

    },
    authenticateUser() {
      const dataAuth = {
        token: 'Bearer ' + storage.getLocalToken()
      }
      this.socket.emit('authenticate', dataAuth);
    },
		changeTalk(contact) {
      window.console.log(contact)
      if (!contact.talks.length) {
        this.getMessages(contact)
      }
      contact.notification = false
      this.currentState.contact = contact
      this.scrollEnd()
		},
		getDataProfile() {
      servicesPages.pages.profile()
			.then(res => {
        window.console.log(res.data)
        this.profile = res.data.profile
			})
			.catch(err => {
				console.log(err)
			})
		},
		getContacts() {
			this.contacts = []
      servicesPages.pages.contactslist()
			.then(res => {
				this.contacts = res.data.contacts
			})
			.catch(err => {
				console.log(err)
			})
		},
		getMessages(contact, callBackFunction) {
      this.talks = []
      servicesPages.pages.messages({contactId: contact.id_contact})
			.then(res => {
        contact.talks = res.data.talks

        if (callBackFunction)
          callBackFunction()

        this.scrollEnd()
			})
			.catch(err => {
				console.log(err)
      })
		},
		newMessage() {
			if (this.currentState.message.trim() == '') {
				return false;
      }

      if (Object.keys(this.currentState.contact).length === 0) {
        return false;
      }
      
      const token = 'Bearer ' + storage.getLocalToken()

      this.currentState.contact.talks.push({ method: 'sent', message: this.currentState.message })
      this.scrollEnd()

			const actionClient = {
				id_contact: this.currentState.contact.id_contact,
        message: this.currentState.message,
        token: token,
        actionType: 'message'
			}
      this.currentState.message = ''
      this.socket.emit('actionClient', actionClient);
    },
    sendTyping() {
      const token = 'Bearer ' + storage.getLocalToken()
      const actionClient = {
				id_contact: this.currentState.contact.id_contact,
        message: '',
        token: token,
        actionType: 'typing'
      }
      
      this.socket.emit('actionClient', actionClient);
    }
	},
  computed: {
    ...mapState('auth', ['user'])
  }
}
</script>

<template src="./home.html"/>

<style src="./home.scss" scoped lang="scss">
  @import 'style';
</style>
