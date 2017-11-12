const itemsCount = 6;
const pagesRange = 4;

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
    // if (!req.user) return res.sendStatus(401);
    // next();
    if(!req.user){
        error(401,"unauthorized",next);
    }
    next();
}

function checkAdmin(req, res, next) {
    // if (req.user.isAdmin !== true) return res.sendStatus(403);
    // next();
    if(!req.user){
        error(403,"forbidden",next);
    }
    next();
}
function error(status, text, next) {
    let error = new Error(text);
    error.status = status;
    next(error);
}

module.exports = {
    paginate: paginate,
    checkAuth: checkAuth,
    checkAdmin: checkAdmin,
    error:error

};