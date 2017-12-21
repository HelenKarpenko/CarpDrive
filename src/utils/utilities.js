const itemsCount = 6;
const pagesRange = 4;
const adminId = '5a0c9091180b171fde9b15d8'
function paginate(items, page,subURL) {
    let args = {};
    let startItem = (page - 1) * itemsCount;
    args.pageCount = Math.trunc(items.length / itemsCount) + ((items.length % itemsCount > 0) ? 1 : 0);
    args.items = items.slice(startItem, startItem + itemsCount);
    args.currentPage = page;
    args.range = pagesRange;
    args.subURL = subURL;
    return args;
}

function checkAuth(req, res, next) {
    if(!req.user){
        error(401,"unauthorized",next);
    }
    next();
}

function checkMyFolder(req, res, next) {
    if(req.user._id === req.params.id.owner){
        error(401,"unauthorized",next);
    }
    next();
}

function checkAdmin(req, res, next) {
    if((String)(req.user._id) !== (String)(adminId)){
        error(403,"forbidden",next);
    }
    next();
}

function checkMainFolder(req, res, next) {
    if(req.user.folder == req.params.id){
        error(403,"forbidden",next);
    }
    next();
}

function error(status, text, next) {
    let error = new Error(text);
    error.status = status;
    next(error);
}

function checkAdminRemove(req, res, next) {
    if((String)(req.params.id) === (String)(adminId)){
        error(403,"forbidden",next);
    }
    next();
}



module.exports = {
    paginate: paginate,
    checkAuth: checkAuth,
    checkAdmin: checkAdmin,
    checkMainFolder: checkMainFolder,
    checkMyFolder: checkMyFolder,
    checkAdminRemove: checkAdminRemove,
    error:error

};