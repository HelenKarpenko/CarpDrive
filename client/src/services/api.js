import axios from 'axios'
import storage from "./storage/storage";
import Globals from "./globals";
export default {
  noAuth(){
    return new axios.create({
      baseURL: Globals.ROOT_URL,
    })
  },
  basicAuth(username, password) {
    return new axios.create({
      baseURL:  Globals.ROOT_URL,
      auth: {
        username: username,
        password: password,
      }
    })
  },
  bearerAccessAuth() {
    console.log(storage.state.accessToken)
    return new axios.create({
      baseURL:  Globals.ROOT_URL,
      headers: {'authorization': "Bearer " + storage.state.accessToken}
    })
  },
  bearerRefreshAuth() {
    return new axios.create({
      baseURL:  Globals.ROOT_URL,
      headers: {'Authorization': "Bearer" + storage.state.refreshToken}
    })
  }
}
