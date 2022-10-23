type BlogsType = {
    id: string,
    name: string,
    youtubeUrl: string
}

export let blogs: BlogsType[] = [
    {
        id: String(new Date().getTime()),
        name: "Blogger A",
        youtubeUrl: "https://www.bloggerA.com"
    }
]

export const blogsRepository = {
    findBlogs() {
        return blogs;
    },
    createBlog(name: string, youtubeUrl: string) {

        const newBlog = {
            id: (+(new Date())).toString(),
            name: name,
            youtubeUrl: youtubeUrl
        }
        blogs.push(newBlog)
        return newBlog;

    },
    findBlogById(id: string) {
        let blog = blogs.find(b => b.id === id)
        return blog;
    },
    updateBlog(id: string, name: string, youtubeUrl: string) {

        let blog = blogs.find(b => b.id === id)

        if (!blog) {
            return false;
        } else {
            blog.name = name
            blog.youtubeUrl = youtubeUrl
            return true;
        }
    },
    deleteBlog(id: string) {
        const newBlogs = blogs.filter(b => b.id !== id)
        if (newBlogs.length < blogs.length) {
            blogs = newBlogs
            return true;
        } else {
            return false;
        }
    }
}