import API from './api';

export default {
  find(args) {
    let query = 'api/v1/my-drive';
    return API.noAuth().get(query);
  },
  addNewFolder(parent, args) {
    console.log(parent);
    console.log(`api/v1/my-drive/${parent}`);
    return API.bearerAccessAuth().post(`api/v1/my-drive/${parent}`, args);
    // return API().post(`api/v1/my-drive/5a30671f7dadbb136173ad05`);
  },
  removeFolder(id) {
    console.log(`api/v1/my-drive/${id}`);
    return API.bearerAccessAuth().delete(`api/v1/my-drive/${id}`);
  },
  renameFolder(id, name) {
    console.log(`api/v1/my-drive/${id}`);
    return API.bearerAccessAuth().put(`api/v1/my-drive/${id}`, name);
  },
  get(id) {
      let query = 'api/v1/my-drive/';
      if(id){
        query +=`${id}`
      }
    return API.bearerAccessAuth().get(query);
    },
}
