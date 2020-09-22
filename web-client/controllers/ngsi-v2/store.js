//
// This controller is an example of accessing and amending the Context Data
// programmatically. The code uses a nodejs library to envelop all the
// necessary HTTP calls and responds with success or failure.
//

const debug = require("debug")("tutorial:ngsi-v2");
const axios = require("axios");
const CB_URL = process.env.CONTEXT_BROKER || "http://localhost:1027/v2";
const Security = require("../security");

debug("Store is retrieved using NGSI-v2");

// This function receives the details of all stores
//
// It is effectively processing the following cUrl command:
//   curl -X GET \
//     'http://{{orion}}/v2/entities/?type=Store&options=keyValues'
//

async function displayStores(req, res, next) {
  debug("listStores");
  if (!res.locals.authorized) {
    req.flash("error", "Access Denied");
    res.redirect("/");
  } else {
    const headers = Security.setAuthHeaders(req);
    const options = {
      method: "GET",
      url: `${CB_URL}/entities`,
      params: {
        type: "Store",
        options: "keyValues"
      },
      //headers to pep proxy
      headers
    };
    try {
      const response = await axios(options);
      const stores = response.data;
      res.render("stores", {
        title: "Prueba Stores",
        stores,
        success: req.flash("success"),
        errors: req.flash("error"),
        info: req.flash("info")
      });
    } catch (error) {
      debug("displaStores error");
      console.error(error);
      next(error);
    }
  }
}

// This function receives all products and a set of inventory items
//  from the context
//
// It is effectively processing the following cUrl commands:
//   curl -X GET \
//     'http://{{orion}}/v2/entities/?type=Product&options=keyValues'
//   curl -X GET \
//     'http://{{orion}}/v2/entities/?type=InventoryItem&options=keyValues&q=refStore==<entity-id>'
//
async function displayTillInfo(req, res, next) {
  debug("displayTillInfo");
  if (!res.locals.authorized) {
    req.flash("error", "Access Denied");
    res.redirect("/");
  } else {
    const headers = Security.setAuthHeaders(req);
    const options = [
      {
        method: "GET",
        url: `${CB_URL}/entities`,
        params: {
          type: "Product",
          options: "keyValues"
        },
        //headers to pep proxy
        headers
      },
      {
        method: "GET",
        url: `${CB_URL}/entities`,
        params: {
          options: "keyValues",
          type: "InventoryItem",
          q: "refStore==" + req.params.storeId
        },
        //headers to pep proxy
        headers
      }
    ];
    try {
      const productsResponse = await axios(options[0]);
      const products = productsResponse.data;
      const inventoryResponse = await axios(options[1]);
      const inventory = inventoryResponse.data;
      res.render("till", {
        products,
        inventory,
        storeId: req.params.storeId
      });
    } catch (error) {
      debug("displaStores error");
      console.error(error);
      next(error);
    }
  }
}

// This asynchronous function retrieves and updates an inventory item from the context
//
// It is effectively processing the following cUrl commands:
//
//   curl -X GET \
//     'http://{{orion}}/v2/entities/<entity-id>?type=InventoryItem&options=keyValues'
//   curl -X PATCH \
//     'http://{{orion}}/v2/entities/urn:ngsi-ld:Product:001/attrs' \
//     -H 'Content-Type: application/json' \
//     -d ' {
//        "shelfCount":{"type":"Integer", "value": 89}
//     }'
//
// There is no error handling on this function, it has been
// left to a function on the router.
async function buyItem(req, res, next) {
  debug("buyItem");
  if (!res.locals.authorized) {
    req.flash("error", "Access Denied");
    res.redirect("/");
  } else {
    const headers = Security.setAuthHeaders(req);
    const options = [
      {
        method: "GET",
        url: `${CB_URL}/entities/${req.params.inventoryId}`,
        params: {
          type: "InventoryItem",
          options: "keyValues"
        },
        //headers to pep proxy
        headers
      }
    ];
    try {
      const inventoryItemResponse = await axios(options[0]);
      const inventoryItem = inventoryItemResponse.data;
      const count = inventoryItem.shelfCount - 1;
      const headers = Security.setAuthHeaders(req);
      headers["Content-Type"] = "application/json";
      options.push({
        method: "PATCH",
        url: `${CB_URL}/entities/${req.params.inventoryId}/attrs`,
        headers,
        data: JSON.stringify({ shelfCount: { type: "Integer", value: count } })
      });
      await axios(options[1]);
      res.redirect(`/app/store/${inventoryItem.refStore}/till`);
    } catch (error) {
      debug("buyItem error");
      console.error(error);
      next(error);
    }
  }
}

module.exports = {
  buyItem,
  displayStores,
  displayTillInfo
};
