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
    blogs.forEach(({ author }) => blogCounter[author] = (blogCounter[author] || 0) + 1)

    const HighestBlogCount = Math.max(...Object.values(blogCounter))
    const authors = Object.keys(blogCounter)

    const authorWithMostBlogs = authors.find(e => 
        blogCounter[e] === HighestBlogCount)

    return `${authorWithMostBlogs}, ${HighestBlogCount}`
}

const mostLikes = (blogs) => {
    const likeCounter = {}
    blogs.forEach(({ author, likes }) => 
        likeCounter[author] = (likeCounter[author] || 0) + likes
    )
    
    const higestLikeCount = Math.max(...Object.values(likeCounter))
    const authors = Object.keys(likeCounter)

    const authorWithMostLikes = authors.find(e => 
        likeCounter[e] === higestLikeCount)

    return `${authorWithMostLikes}, ${higestLikeCount}`
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}