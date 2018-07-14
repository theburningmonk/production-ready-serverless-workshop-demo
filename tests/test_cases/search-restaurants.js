const { expect } = require('chai')
const { init } = require('../steps/init')
const when = require('../steps/when')
const tearDown = require('../steps/tearDown')
const given = require('../steps/given')

describe('Given an authenticated user', () => {
  let user

  before(async () => {
    await init()
    user = await given.an_authenticated_user()
  })

  after(async () => {
    await tearDown.an_authenticated_user(user)
  })

  describe(`When we invoke the POST /restaurants/search endpoint with theme 'cartoon'`, () => {
    before(async () => await init())
  
    it(`Should return an array of 4 restaurants`, async () => {
      let res = await when.we_invoke_search_restaurants(user, 'cartoon')
  
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.have.lengthOf(4)
  
      for (let restaurant of res.body) {
        expect(restaurant).to.have.property('name')
        expect(restaurant).to.have.property('image')
      }
    })
  })
})