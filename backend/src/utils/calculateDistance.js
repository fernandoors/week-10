function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

module.exports = function getDistanceFromLatLonInKm(centerCoordinates, pointCoodinates) {
  const radius = 6371
  const { lat: lat1, long: lon1 } = centerCoordinates
  const { lat: lat2, long: lon2 } = pointCoodinates

  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) + Math.sin(dLon / 2)

  const center = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = radius * center
  return distance
}