const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
module.exports = {
  async index(req, res) {
    const { lat, long, techs } = req.query
    const techArray = parseStringAsArray(techs)
    const devs = await Dev.find({
      techs: {
        $in: techArray
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [long, lat]
          },
          $maxDistance: 10000
        }
      }
    })
    return res.json({ devs })
  }
}