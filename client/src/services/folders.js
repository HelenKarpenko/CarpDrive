import API from './api';

export default {
  find(args) {
    let query = 'api/v1/my-drive';
    return API.noAuth().get(query);
  },
  addNewItem(parent,args) {
    console.log(parent);
    console.log(`api/v1/my-drive/${parent}`);
    return API.bearerAccessAuth().post(`api/v1/my-drive/${parent}`, args);
    // return API().post(`api/v1/my-drive/5a30671f7dadbb136173ad05`);
  },
  removeItem(id) {
    return API().delete(`api/v1/folders/${id}`,);
  },
  get(id) {
      let query = 'api/v1/my-drive/';
      if(id){
        query +=`${id}`
      }
    return API.bearerAccessAuth().get(query);
    },
}
