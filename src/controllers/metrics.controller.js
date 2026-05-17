const { register } = require("../middleware/metrics");

async function metrics(req, res) {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
}

module.exports = {
  metrics
};
