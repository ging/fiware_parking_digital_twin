const NGSI_VERSION = process.env.NGSI_VERSION || "ngsi-v2";
const express = require("express");
const router = express.Router();
const Store = require("../controllers/" + NGSI_VERSION + "/store");
const Security = require("../controllers/security");

// ----- IF EXISTS SESSION AND TOKEN EXPIRED REFRESH IT ----- //
router.all("*", Security.refreshToken);

//----- HANDLE REQUEST TO THE MAIN PAGE -----//
router.get("/", (req, res) => {
  res.render("index", {
    title: "Prueba Stores",
    success: req.flash("success"),
    errors: req.flash("error"),
    info: req.flash("info")
  });
});
router.get("/app/store", Security.authenticate, Store.displayStores);

//----- LOGS USERS USING KEYROCK -----//
// Link to authenticate
router.get("/authCodeGrant", Security.authCodeGrant);
// Callback when user is authenticated
router.get("/login", Security.authCodeGrantCallback);
router.get("/logout", Security.logOut);

//----- OTHER INTERACTIONS -----//
// Display products for sale
router.get(
  "/app/store/:storeId/till",
  Security.authenticate,
  Store.displayTillInfo
);
// Buy something.
router.post(
  "/app/inventory/:inventoryId",
  Security.authorizeBasicPDP,
  Store.buyItem
);

// Whenever a subscription is received, print it
// Answer orion with 204
router.post("/subscription/:type", (req, res) => {
  console.warn("Subscription event ", req.params.type, req.body.data);
  res.status(204).send();
});

module.exports = router;
