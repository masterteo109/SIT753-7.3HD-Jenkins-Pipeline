const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const config = require("./config");
const logger = require("./utils/logger");
const requestId = require("./middleware/requestId");
const { metricsMiddleware } = require("./middleware/metrics");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const apiRoutes = require("./routes");
const healthRoutes = require("./routes/health.routes");
const metricsRoutes = require("./routes/metrics.routes");
const viewRoutes = require("./routes/view.routes");

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(requestId);
app.use(metricsMiddleware);

app.get("/", (req, res) => {
  res.redirect("/view");
});

app.use(
  rateLimit({
    windowMs: config.rateLimitWindowMs,
    limit: config.rateLimitMax,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.use("/health", healthRoutes);
app.use("/metrics", metricsRoutes);
app.use("/view", viewRoutes);
app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
