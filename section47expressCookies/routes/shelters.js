const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("ALL SHELTERS");
});

router.post("/", (req, res) => {
  res.send("CREATING SHELTER");
});

router.get("/:id", (req, res) => {
  res.send(`viewing ${req.params.id} shelter`);
});

router.get("/:id/edit", (req, res) => {
  res.send(`editing ${req.params.id} shelter`);
});

module.exports = router;
