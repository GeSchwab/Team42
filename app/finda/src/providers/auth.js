import {apiURL} from "../config"
import Http from './http'
import axios from 'axios';

export default class AuthProvider {
  static singleton = null
  static getInstance() {
    if(!AuthProvider.singleton)AuthProvider.singleton = new AuthProvider()
    return AuthProvider.singleton
  }

  constructor() {
  }
  isLoggedIn() {
    return !!this.getToken()
  }
  getToken() {
    return window.localStorage.getItem('token')
  }
  setToken(token) {
    return window.localStorage.setItem('token',token)
  }
  logout() {
    window.localStorage.removeItem('token')
  }
  // here it assumes that all the required fields are there
  async register(payload) {
    let response = await Http.post(`${apiURL}/auth/register`,payload)
    let data = await response.json()
    let token = data.token
    if(token) this.setToken(token)
    return token
  }

  async login(payload) {
    let response = await Http.post(`${apiURL}/auth/login`,payload)
    let data = await response.json()
    let token = data.token
    if(token) this.setToken(token)
    return token
  }

  async authenticatedGet(url,params = {}) {
    let response = await Http.get(`${apiURL}${url}`,params,{"x-access-token": this.getToken()})
    return response
  }

  async authenticatedPost(url, data = {}) {
    let response = await Http.post(`${apiURL}${url}`,data,{"x-access-token": this.getToken()})
    return response
  }

  async imageUploadPost(url, data = {}) {
    const formData = new FormData();
    formData.append('image', data)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    let response = await axios.post(apiURL + url, formData,config)
    response = JSON.stringify(response.data.path)
    console.log(response)
    return response
  }

  async userImageUploadPost(url, data = {}, username) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('image', data);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    let response = await axios.post(apiURL + url, formData,config)
    response = JSON.stringify(response.data.path)
    console.log(response)
    return response
  }

  async authenticatedDelete(url, data = {}) {
    let response = await Http.delete(`${apiURL}${url}`,data,{"x-access-token": this.getToken()})
    return response
  }

  async authenticatedPatch(url, data = {}) {
    let response = await Http.patch(`${apiURL}${url}`,data,{"x-access-token": this.getToken()})
    return response
  }
}
