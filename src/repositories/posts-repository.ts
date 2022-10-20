type PostsType = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

let posts: PostsType[] = [
    {
        id: +(new Date().getTime()),
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
    createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string) {

        const newPost = {
            id: +(new Date()),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName
        }
        posts.push(newPost)
        return newPost;

    },
    findPostById(id: number) {
        let post = posts.find(p => p.id === id)
        return post;
    },
    updatePost(id: number, title: string, shortDescription: string, content: string, blogId: string, blogName: string) {

        let post = posts.find(p => p.id === id)

        if (!post) {
            return false;
        } else {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.blogId = blogId
            post.blogName = blogName
            return true;
        }
    },
    deletePost(id: number) {
        const newPosts = posts.filter(p => p.id !== id)
        if (newPosts.length < posts.length) {
            posts = newPosts
            return true;
        } else {
            return false;
        }
    }
}