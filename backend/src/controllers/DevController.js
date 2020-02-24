const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
module.exports = {

  async index(req, res) {
    const dev = await Dev.find()
    return res.json(dev)
  },
  async store(req, res) {
    const { github_username, techs, lat, long } = req.body

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const response = await axios.get(`https://api.github.com/users/${github_username}`)
      const { name = login, avatar_url, bio } = response.data

      const techArray = parseStringAsArray(techs)

      const location = {
        type: 'Point',
        coordinates: [long, lat]
      }

      dev = await Dev.create({
        name,
        github_username,
        avatar_url,
        bio,
        location,
        techs: techArray
      })
    }

    return res.json(dev)
  }
}