import API from './api';

export default {
  find(args) {
    let query = 'api/v1/my-drive';
    // if(args.filterString){
    //   query +=`name=${args.filterString}&`
    // }
    // if(args.page){
    //   query +=`page=${args.page}&`
    // }
    // if(args.limit){
    //   query += `limit=${args.limit}&`
    // }
    return API.noAuth().get(query);
  },
  getItem(id) {
    return API().noAuth().get(`api/v1/folders/${id}`);
  },
  getImage() {
    return API().noAuth().get('api/v1/folders/image/:id');
  },
  addNewItem(args) {
    let form=new FormData();
    for(var key in args){
      form.append(key,args[key]);
    }
    console.log(form)
    return API().post(`api/v1/folders`, form);
  },
  removeItem(id) {
    return API().delete(`api/v1/folders/${id}`,);
  },
  get(id) {
      let query = 'api/v1/my-drive/';
      if(id){
        query +=`${id}`
      }
      console.log(query);
    return API.noAuth().get(query);
    },
}
