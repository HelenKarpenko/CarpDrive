import API from './api';

export default {
  login(credentials){
    return API.basicAuth(credentials.username,credentials.password).post('/api/v1/auth/login');
  },
  signup(registration){
    return API.noAuth().post('/api/v1/auth/register',registration);
  }
}
