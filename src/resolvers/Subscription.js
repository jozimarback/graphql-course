const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;
            setInterval(() => {
                count++;
                pubsub.publish('count', {
                    count
                }, 1000)
            })

            return pubsub.asyncIterator('count')
        }
    },
    comment:{
        subscribe(parent,{postId},{db, pubsub},info){
            const post = db.post.find((post) => post.id === postId && post.publish);
            if(!post){
                throw new Error('Post not found')
            }
            pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post:{
        subscribe(parent,args,{pubsub},info){
            pubsub.asyncIterator('post');
        }
    }
}
export { Subscription as default }