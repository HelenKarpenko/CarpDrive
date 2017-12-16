import axios from 'axios'
import storage from "./storage/storage";

export default {
  noAuth(){
    return new axios.create({
      baseURL: `http://localhost:3001`,
    })
  },
  basicAuth(username, password) {
    return new axios.create({
      baseURL: `http://localhost:3001`,
      auth: {
        username: username,
        password: password,
      }
    })
  },
  bearerAccessAuth() {
    console.log(storage.state.accessToken)
    return new axios.create({
      baseURL: `http://localhost:3001`,
      headers: {'authorization': "Bearer " + storage.state.accessToken}
    })
  },
  bearerRefreshAuth() {
    return new axios.create({
      baseURL: `http://localhost:3001`,
      headers: {'Authorization': "Bearer" + storage.state.refreshToken}
    })
  }
}
