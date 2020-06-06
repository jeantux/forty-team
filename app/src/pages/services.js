export default { pages: 
    {
      profile: { method: 'get', url: 'profile' },
      setProfile: { method: 'post', url: 'profile' },
      contactslist: { method: 'get', url: 'contactslist' },
      messages: { method: 'get', url: 'messages' },
      sendmessage: { method: 'post', url: 'sendmessage' },
      searchUsers: { method: 'get', url: 'search-users' },
      invitations: { method: 'get', url: 'invitations' },
      acceptInvite: { method: 'post', url: 'acceptInvite' },
      rejectInvite: { method: 'post', url: 'rejectInvite' },
      config: { method: 'post', url: 'config' },
      uploadImageProfile: {method: 'post', url: 'uploadImageProfile' }
    }
  }
  