import API from './api';
import Auth from './auth';

export default {
  addNewFolder(parent, args) {
    console.log(parent);
    console.log(`/api/v1/my-drive/${parent}`);
    return API.bearerAccessAuth().post(`/api/v1/my-drive/${parent}`, args);
    // return API().post(`api/v1/my-drive/5a30671f7dadbb136173ad05`);
  },
  removeFolder(id) {
    console.log(`/api/v1/my-drive/${id}`);
    return API.bearerAccessAuth().delete(`/api/v1/my-drive/${id}`);
  },
  renameFolder(id, name) {
    console.log(`api/v1/my-drive/${id}`);
    return API.bearerAccessAuth().put(`/api/v1/my-drive/${id}`, name);
  },
  addNewFile(parent, args) {
    let form = new FormData();
    for(var key in args){
      form.append(key,args[key]);
    }
    console.log("<<<<<")
    console.log(form)
    return API.bearerAccessAuth().post(`/api/v1/my-drive/${parent}`, form);
  },
  get(id) {
      let query = '/api/v1/my-drive/';
      if(id){
        query +=`${id}`
      }
      console.log(query);
    return API.bearerAccessAuth().get(query).catch(async err=>{
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
  getPath(id) {
    return API.bearerAccessAuth().get(`/api/v1/my-drive/${id}/path`);
  },
  copyFolder(id){
    console.log(`api/v1/my-drive/${id}/copy`);
    return API.bearerAccessAuth().get(`/api/v1/my-drive/${id}/copy`);
  },
  shareFolder(id, username){
    return API.bearerAccessAuth().post(`/api/v1/my-drive/${id}/share`, username);
  },
  getSharedFolder(id) {
    return API.bearerAccessAuth().get(`/api/v1/shared/${id}`);
  },
  getSharedTree(id) {
    return API.bearerAccessAuth().get(`api/v1/shared/${id}/tree`);
  },
  showFile(id) {
    return API.bearerAccessAuth().get(`/api/v1/my-drive/${id}/file`,{ responseType:"blob" });
  },
  getFileType(id) {
    return API.bearerAccessAuth().get(`/api/v1/my-drive/${id}/fileType`);
  },
  getFileInfo(id) {
    return API.bearerAccessAuth().get(`/api/v1/my-drive/${id}/fileInfo`);
  },
  findByName(filterString, id){
    let query = `/api/v1/my-drive/find?`;
    if(filterString){
      console.log("true")
      query +=`name=${filterString}&`
    }
    console.log(query);
    return API.bearerAccessAuth().get(query);
  }
}
