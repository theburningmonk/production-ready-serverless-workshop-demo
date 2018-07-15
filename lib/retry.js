const AWS = require('aws-sdk')
const sns = new AWS.SNS()

const retryTopicArn = process.env.restaurant_notification_retry_topic

const restaurantNotification = async (order) => {
  let snsReq = {
    Message: JSON.stringify(order),
    TopicArn: retryTopicArn
  };
  await sns.publish(snsReq).promise()
  console.log(`order [${order.orderId}]: queued restaurant notification for retry`)
}

module.exports = {
  restaurantNotification
}