const NGSI_VERSION = process.env.NGSI_VERSION || "ngsi-v2";
const express = require("express");
const router = express.Router();
const Store = require("../controllers/" + NGSI_VERSION + "/store");

// Handles requests to the main page
router.get("/", Store.displayStores);

// Display products for sale
router.get("/app/store/:storeId/till", Store.displayTillInfo);
// Buy something.
router.post("/app/inventory/:inventoryId", Store.buyItem);

// Whenever a subscription is received, print it
// Answer orion with 204
router.post("/subscription/:type", (req, res) => {
  console.warn("Subscription event ", req.params.type, req.body.data);
  res.status(204).send();
});

module.exports = router;
