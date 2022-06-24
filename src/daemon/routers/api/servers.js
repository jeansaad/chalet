const express = require("express");

module.exports = group => {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json(group.list());
  });

  router.get("/:id/port", (req, res) => {
    const port = group.findPort(req.params.id);
    if (port) res.json(port);
    return res.end();
  });

  router.post(
    "/:id/start",
    group.exists.bind(group),
    group.start.bind(group),
    (req, res) => res.end()
  );

  router.post(
    "/:id/stop",
    group.exists.bind(group),
    group.stop.bind(group),
    (req, res) => res.end()
  );

  return router;
};
