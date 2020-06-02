const dummy = (blogs) => {
    return blogs.reduce((ac, blog) => ac + blog.likes, 0)
}

module.exports = {dummy}