const express = require("express");
const router = express.Router();

const supportHubRoutes = require("./supportHub.routes");

router.use("/supporthub-ai", supportHubRoutes);

module.exports = router;