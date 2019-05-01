const Subscription = { 
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