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
        contact: {},
        searchContacts: ''
      },
      imageDefaultUser: 'images/icon-user-default.png',
      allContacts: [],
      contacts: [],
      profile: {},
      socket: io(process.env.VUE_APP_ROOT_API)
    }
  },
	created() {
		this.getContacts()
    this.getDataProfile()
    this.authenticateUser()
    this.socketsEvents()
    this.getInvitations()
	},
	methods: {
    ...mapActions('auth', ['ActionSignOut']),
    signOut () {
      this.ActionSignOut()
      this.$router.push({ name: 'login' })
    },
    getInvitations() {
      servicesPages.pages.invitations({})
        .then(res => {
          const invitations = res.data
          for (const index in invitations) {
            const invite = invitations[index]

            const newUserConvide = {
              invitation: true,
              description: 'invitation',
              id_contact: invite.contact_id,
              name: invite.name,
              picture: invite.picture,
              notification: true
            }

            this.addNewInvite(newUserConvide)
          }
        })
        .catch(err => window.console.log(err))
    },
    acceptInvite(user) {
      servicesPages.pages.acceptInvite({ id_contact: user.id_contact })
        .then(() => {
          this.currentState.contact = {}
          this.getContacts()
          this.getInvitations()
        })
        .catch((err) => { window.console.log(err) })
    },
    rejectInvite(user) {
      servicesPages.pages.rejectInvite({ id_contact: user.id_contact })
        .then(() => {
          this.currentState.contact = {}
          this.getContacts()
          this.getInvitations()
        })
        .catch(() => {  })
    },    
    addNewInvite(newUserConvide) {
          let existsInvitation = false
          for (const index in this.allContacts) {
              const contact = this.allContacts[index]
              if (contact.id_contact == newUserConvide.id_contact)
                existsInvitation = true
          }

          if (!existsInvitation)
            this.allContacts.push(newUserConvide)
    },
    searchInContacs(){
      this.contacts = []
      for (const index in this.allContacts) {        
          const contact = this.allContacts[index]
          if (contact.name.toLowerCase().indexOf(this.currentState.searchContacts.toLowerCase()) !== -1) {
            this.contacts.push(contact)
          }
      }
    },
    loadAllContacts() {
      this.contacts = this.allContacts
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
              window.console.log('New message')
              currentContact.notification = true
            }
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
      })

      this.socket.on('adduser', data => {
        const newUserConvide = {
          invitation: true,
          description: 'invitation',
          id_contact: data.id_contact,
          name: data.name,
          picture: data.picture,
          notification: true
        }
        
        this.addNewInvite(newUserConvide)
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
      if (!contact.invitation) {
        if (!contact.talks.length) {
          this.getMessages(contact)
        }
        contact.notification = false
      }
      this.currentState.contact = contact
      this.scrollEnd()      
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
		getContacts() {
      this.contacts = []
      this.allContacts = []
      servicesPages.pages.contactslist()
			.then(res => {
        this.allContacts = res.data.contacts
        this.loadAllContacts()
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
