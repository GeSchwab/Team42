import Auth from './auth'

// Providers for interacting with /me endpoint
export default class Me {
  static singleton = null
  static getInstance() {
    if(!Me.singleton)Me.singleton = new Me()
    return Me.singleton
  }

  constructor() {
    this.auth = Auth.getInstance()
    if(this.auth.isLoggedIn()) {
      this.getUser().then(user => this.user = user)
    } else this.user = null
  }

  async getUser() {
    if(this.user) return this.user
    if(!this.auth.isLoggedIn()) return null
    let response = await this.auth.authenticatedGet('/me/info')
    let user = await response.json()
    this.user = user
    return user
  }

  async uploadImage(image) {
    console.log('image is here: ' + image.name);
    if(!this.user) {
      return null;
    }
    else {
      let response = await this.auth.imageUploadPost('/me/upload', image)
      console.log('only response...' + response)
      return response
    }
  }

  async uploadUserImage(image, userName) {
    console.log('image is here: ' + image.name);
    if(!this.user) {
      return null;
    }
    else {
      let response = await this.auth.userImageUploadPost('/me/upload', image, userName);
      console.log('only response...' + response);
      return response;
    }
  }

  async addWants(want) {
    if(!this.user) {
      return null
    }
    else {
      let response = await this.auth.authenticatedPost('/me/wants',want)
      return response
    }
  }

  async deleteWants(want) {
    if(!this.user) {
      return null
    }
    else {
      let response = await this.auth.authenticatedDelete('/me/wants',want)
      return response
    }
  }

  async addOffers(offer) {
    if(!this.user) {
      return null
    }
    else {
      let response = await this.auth.authenticatedPost('/me/offers',offer)
      return response
    }
  }

  async deleteOffers(offer) {
    if(!this.user) {
      return null
    }
    else {
      let response = await this.auth.authenticatedDelete('/me/offers',offer)
      return response
    }
  }

  async addGroups(group) {
    if(!this.user) {
      return null
    }
    else {
      console.log("Group")
      console.log(group)
      let response = await this.auth.authenticatedPost('/group',group)
      return response
    }
  }

  async toPremium() {
    if(!this.auth.isLoggedIn()) {
      return null
    }
    if(!this.user) {
      return null
    }
    if(this.user.isPremium) {
      return null
    }
    let response = await this.auth.authenticatedPost('/me/toPremium')
    let isPremium = await response.json()
    return isPremium
  }
}
