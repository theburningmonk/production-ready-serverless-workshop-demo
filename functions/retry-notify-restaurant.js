const notify = require('../lib/notify')
const wrap = require('../lib/wrapper')

module.exports.handler = wrap(async (event, context) => {
  const order = JSON.parse(event.Records[0].Sns.Message)
  order.retried = true

  await notify.restaurantOfOrder(order)
})