const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const sns = new AWS.SNS()
const Log = require('../lib/log')

const retryTopicArn = process.env.restaurant_notification_retry_topic

const restaurantNotification = async (order) => {
  let snsReq = {
    Message: JSON.stringify(order),
    TopicArn: retryTopicArn
  };
  await sns.publish(snsReq).promise()
  Log.info(`order [${order.orderId}]: queued restaurant notification for retry`)
}

module.exports = {
  restaurantNotification
}