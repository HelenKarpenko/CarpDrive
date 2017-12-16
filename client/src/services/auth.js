import API from './api';

export default {
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
