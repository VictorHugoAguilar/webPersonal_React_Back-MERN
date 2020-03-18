const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    url: {
        type: String,
        unique: true
    },
    description: String,
    date: Date
});

PostSchema.plugin(paginate);

module.exports = mongoose.model('Post', PostSchema); 
