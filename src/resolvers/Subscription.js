const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;

            return pubsub.asyncIterator('count')
        }
    }
}
export { Subscription as default }