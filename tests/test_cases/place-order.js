const { expect } = require('chai')
const when = require('../steps/when')
const given = require('../steps/given')
const tearDown = require('../steps/tearDown')
const { init } = require('../steps/init')
const AWS = require('mock-aws')

describe('Given an authenticated user', () => {
  let user

  before(async () => {
    await init()
    user = await given.an_authenticated_user()
  })

  after(async () => {
    await tearDown.an_authenticated_user(user)
  })

  describe(`When we invoke the POST /orders endpoint`, () => {
    let isEventPublished = false
    let resp

    before(async () => {
      AWS.mock('Kinesis', 'putRecord', (req) => {
        isEventPublished = 
          req.StreamName === process.env.order_events_stream &&
          JSON.parse(req.Data).eventType === 'order_placed'

        return {
          promise: async () => {}
        }
      })

      resp = await when.we_invoke_place_order(user, 'Fangtasia')
    })

    after(() => AWS.restore('Kinesis', 'putRecord'))

    it(`Should return 200`, async () => {
      expect(resp.statusCode).to.equal(200)
    })
  
    if (process.env.TEST_MODE === 'handler') {
      it(`Should publish a message to Kinesis stream`, async () => {
        expect(isEventPublished).to.be.true
      })
    }
  })
})