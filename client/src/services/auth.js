import API from './api';
import storage from './storage/storage';

export default {
  async refreshToken(){
    try{
      const result=await API.bearerRefreshAuth().get('/api/v1/auth/token');
      if(result.data.success){
        storage.dispatch('setAccessToken', result.data.tokens.access);
        return true;
      }else{
        return false;
      }
    }catch (err){
      console.log(err.response)
      return false;
    }
  },
  login(credentials){
    return API.basicAuth(credentials.username,credentials.password).post('/api/v1/auth/login');
  },
  signup(credentials){
    return API.noAuth().post('/api/v1/auth/register',credentials);
  },
  logout(credentials){
    return API.bearerAccessAuth(credentials.username,credentials.password).post('/api/v1/auth/logout');
  },
}
