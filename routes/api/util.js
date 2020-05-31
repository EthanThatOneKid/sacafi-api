const router = require("express").Router();
const auth = require("../auth");
const OsmDude = require("osm-dude");

// Preload article objects on routes with ':article'
router.param("coord", function(req, res, next, rawCoord) {
  const [lat, lng] = rawCoord.split(",").map(Number);
  req.coord = { lat, lng };
  return next();
});

// Get osm data from coord
router.get("/osm/:coord", auth.required, async function(req, res) {
  const { lat, lng } = req.coord;
  let result = {};
  try {
    const collisions = await OsmDude.peek(lat, lng);
    if (collisions.length > 0) {
      result = collisions.pop().rawData.meta; // Documentation: https://github.com/EthanThatOneKid/osm-dude
    }
  } catch (err) {
    console.warn(err);
  }
  return res.json(result);
});

module.exports = router;
