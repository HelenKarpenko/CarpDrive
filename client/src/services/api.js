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
    //todo
  },
  bearerRefreshAuth() {
    //todo
  }
}
