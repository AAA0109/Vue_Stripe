const stripe = require('stripe')('');

const toDate = t => {
  return new Date(t * 1000).toISOString();
}

const fetchBalance = async () => {
    const balances = await stripe.balanceTransactions.list({
        limit: 100
    });
    let total = 0, totalPlus = 0;
    const items = balances.data;
    const disp = items.map(itm => ({
      amount: itm.amount,
      created: toDate(itm.created)
    }))
    disp.map(d => (total += d.amount));
    disp.map(d => (totalPlus += Math.max(d.amount, 0)))

    console.log('total', total, totalPlus);
    console.log(disp);
};

const fetchBillingUrl = async (customerId) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: 'https://dashboard.fluentc.io',
  });
  return session.url;
}

const fetchSubscription = async () => {
  const subscriptions = await stripe.subscriptions.list({
    limit: 100
  });
  const disp = subscriptions.data.map(a => ({
    id: a.id,
    items: a.items,
    customer: a.customer,
    start_date: toDate(a.start_date),
    current_period_start: toDate(a.current_period_start),
    current_period_end: toDate(a.current_period_end)
  }));
  console.log(disp);
  return disp;
}

const fetchCustomer = async () => {
  const customers = await stripe.customers.list({
    limit: 100
  });
  const disp = customers.data.map(a => ({
    id: a.id,
    email: a.email,
    name: a.name,
    created: toDate(a.created)
  }));
  console.log(customers);
  return disp;
}

const combine = async (subscriptions, customers) => {
  const disp = subscriptions.map(itm => ({
    ...itm,
    customer: customers.find(c => c.id === itm.customer)
  }))
  console.log(disp);
  return disp;
}

const fetch = async () => {
  const subscriptions = await fetchSubscription();
  const customers = await fetchCustomer();
  combine(subscriptions, customers);
}

fetch();
// fetchBalance();
// fetchBillingUrl("cus_NU6J2a7Rcajtat");
