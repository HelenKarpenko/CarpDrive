let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let fileSchema = new Schema({
    name: String,
    data: Buffer,
    contentType: String
});

module.exports = mongoose.model('File', fileSchema);

var Post = mongoose.Schema({
    image: {data: Buffer, contentType: String}
});

var post= new Post({ });
post.image.data=fs.readFileSync(req.file.path);
post.image.contentType='image/png';