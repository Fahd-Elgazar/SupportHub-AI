const timestamp = () => new Date().toISOString();

const logger = (req, res, next) => {
  const start = Date.now();

  console.log(
    `[${timestamp()}] ${req.method} ${req.originalUrl}`
  );

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `[${timestamp()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration} ms)`
    );
  });

  next();
};

logger.info = (...message) => {
  console.log(`[INFO] [${timestamp()}]`, ...message);
};

logger.warn = (...message) => {
  console.warn(`[WARN] [${timestamp()}]`, ...message);
};

logger.error = (...message) => {
  console.error(`[ERROR] [${timestamp()}]`, ...message);
};

module.exports = logger;