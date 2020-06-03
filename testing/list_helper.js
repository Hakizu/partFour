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

const mostBlogs = (blogs) => {
    const blogCounter = {}
    blogs.map(b => blogCounter[b.author] = (blogCounter[b.author] + 1 ) || 1 )

    const highestBlogNumber = Math.max(...(Object.values(blogCounter)))
    const author = Object.keys(blogCounter)

    const filterHighest = author.filter(e => 
        blogCounter[e] === highestBlogNumber)

    return (`${filterHighest[0]}, ${highestBlogNumber}`)
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs
}