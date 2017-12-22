import API from './api';
import Auth from './auth';

export default {
  setAvatar(id, args) {
    let form = new FormData();
    for(var key in args){
      form.append(key,args[key]);
    }
    console.log("======")
    console.log(`/api/v1/user/${id}/setAvatar`);
    return API.bearerAccessAuth().post(`/api/v1/user/${id}/setAvatar`, form)
      .catch(async err=>{
      if(err.response.status==401){
        if(await Auth.refreshToken()){
          return this.get(id)
        }else{
          throw err;
        }
      }else{
        throw err;
      }
    });
  },
  showAvatar(id) {
    console.log(`/api/v1/user/${id}/avatar`)
    return API.bearerAccessAuth().get(`/api/v1/user/${id}/avatar`,{ responseType:"blob" });
  },
}
