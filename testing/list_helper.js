const totalLikes = (blogs) => {
    return blogs.reduce((ac, blog) => ac + blog.likes, 0)
}

const favoriteBlog = (blogs) => {

    const highestCount = blogs.reduce((fav, blog) => 
        blog.likes > fav ? blog.likes : fav, 0)

    const fav = blogs.map(e => { 
        if (e.likes === highestCount)
            return e 
        })

    const favoriteBlog = fav.filter(t => t !== undefined)
    return favoriteBlog[0]
}

module.exports = {
    totalLikes,
    favoriteBlog
}