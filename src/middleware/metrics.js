const promClient = require("prom-client");

const register = new promClient.Registry();

promClient.collectDefaultMetrics({
  register,
  prefix: "student_platform_"
});

const httpRequestCounter = new promClient.Counter({
  name: "student_platform_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"]
});

const httpRequestDuration = new promClient.Histogram({
  name: "student_platform_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);

function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationSeconds = Number(end - start) / 1e9;
    const route = req.route ? req.route.path : req.path;

    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode
    };

    httpRequestCounter.inc(labels);
    httpRequestDuration.observe(labels, durationSeconds);
  });

  next();
}

module.exports = {
  metricsMiddleware,
  register
};
