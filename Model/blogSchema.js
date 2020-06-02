const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })

blogSchema.set('toJSON', {
    transform: (document, returnedBlog)  => {
        returnedBlog.id = returnedBlog._id.toString()
        delete returnedBlog._id
        delete returnedBlog.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)