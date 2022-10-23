import {blogs} from "./blogs-repository";

type PostsType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string | null,
    blogName: string | null
}

export let posts: PostsType[] = [
    {
        id: String(new Date().getTime()),
        title: "First Blog",
        shortDescription: "About content",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        blogId: "33",
        blogName: "Name of the blog"
    }
];

export const postsRepository = {
    findPosts() {
        return posts;
    },
    createPost (title: string, shortDescription: string, content: string, blogId: string) {
        const blog = blogs.find(b => b.id === blogId)
        if (blog) {
            const newPost = {
                id: (+(new Date())).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name
            }
            posts.push(newPost)
            return newPost;
        }
    },
    findPostById(id: string) {
        let post = posts.find(p => p.id === id)
        return post;
    },
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const blog = blogs.find(b => b.id === blogId)
        if (!blog) return  false

        let post = posts.find(p => p.id === id)
        if (!post) {
            return false;
        } else {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.blogId = blogId
            post.blogName = blog.name
            return true;
        }
    },
    deletePost(id: string) {
        const newPosts = posts.filter(p => p.id !== id)
        if (newPosts.length < posts.length) {
            posts = newPosts
            return true;
        } else {
            return false;
        }
    }
}