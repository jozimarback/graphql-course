const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }
        return users.filter((user) => user.email.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        }
        return db.posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
            return isTitleMatch || isBodyMatch;
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    },
    me() {
        return {
            id: '123099',
            name: 'Jozimar',
            email: 'jozimar@email.com',
            age: 29
        }
    },
    post() {
        return {
            id: '092',
            title: 'GraphQL 101',
            body: '',
            published: false
        }
    }
};

export { Query as default }