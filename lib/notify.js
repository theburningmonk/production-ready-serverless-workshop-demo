const _ = require('lodash')
const AWS = require('aws-sdk')
const sns = new AWS.SNS()
const kinesis = new AWS.Kinesis()
const chance  = require('chance').Chance()

const streamName = process.env.order_events_stream
const topicArn = process.env.restaurant_notification_topic

const restaurantOfOrder = async (order) => {
  if (chance.bool({likelihood: 75})) { // 75% chance of failure
    throw new Error("boom")
  }

  const snsReq = {
    Message: JSON.stringify(order),
    TopicArn: topicArn
  }
  await sns.publish(snsReq).promise()
  console.log(`notified restaurant [${order.restaurantName}] of order [${order.orderId}]`)

  const data = _.clone(order)
  data.eventType = 'restaurant_notified'

  const kinesisReq = {
    Data: JSON.stringify(data), // the SDK would base64 encode this for us
    PartitionKey: order.orderId,
    StreamName: streamName
  }
  await kinesis.putRecord(kinesisReq).promise()
  console.log(`published 'restaurant_notified' event to Kinesis`)
}

module.exports = {
  restaurantOfOrder
}