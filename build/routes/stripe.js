const stripe = require('stripe')('');

const func = async () => {
    const subscription = await stripe.balanceTransactions.list({
        limit: 100
    });
    console.log(subscription.items);
};
func();
