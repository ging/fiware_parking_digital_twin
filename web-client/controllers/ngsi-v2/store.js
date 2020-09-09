//
// This controller is an example of accessing and amending the Context Data
// programmatically. The code uses a nodejs library to envelop all the
// necessary HTTP calls and responds with success or failure.
//

// Initialization - first require the NGSI v2 npm library and set
// the client instance
const NgsiV2 = require("ngsi_v2");
const defaultClient = NgsiV2.ApiClient.instance;
const debug = require("debug")("tutorial:ngsi-v2");
const request = require("request");
const CB_URL = process.env.CONTEXT_BROKER || "http://localhost:1026/v2";

debug("Store is retrieved using NGSI-v2");

// The basePath must be set - this is the location of the Orion
// context broker. It is best to do this with an environment
// variable (with a fallback if necessary)
defaultClient.basePath =
  process.env.CONTEXT_BROKER || "http://localhost:1026/v2";

// This function receives the details of all stores
//
// It is effectively processing the following cUrl command:
//   curl -X GET \
//     'http://{{orion}}/v2/entities/?type=Store&options=keyValues'
//

function displayStores(req, res, next) {
  debug("listStores");
  const options = {
    method: "GET",
    url: `${CB_URL}/entities`,
    qs: {
      type: "Store",
      options: "keyValues"
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      next(error);
    } else {
      res.render("index", {
        title: "Prueba Stores",
        stores: JSON.parse(body)
      });
    }
  });
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
function displayTillInfo(req, res, next) {
  debug("displayTillInfo");
  const options = [
    {
      method: "GET",
      url: `${CB_URL}/entities`,
      qs: {
        type: "Product",
        options: "keyValues"
      }
    },
    {
      method: "GET",
      url: `${CB_URL}/entities`,
      qs: {
        options: "keyValues",
        type: "InventoryItem",
        q: "refStore==" + req.params.storeId
      }
    }
  ];

  request(options[0], function(error, response, bodyProducts) {
    if (error) {
      next(error);
    } else {
      request(options[1], function(error, response, bodyInventory) {
        if (error) {
          next(error);
        } else {
          res.render("till", {
            products: JSON.parse(bodyProducts),
            inventory: JSON.parse(bodyInventory),
            storeId: req.params.storeId
          });
        }
      });
    }
  });
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
function buyItem(req, res, next) {
  debug("buyItem");
  const options = [
    {
      method: "GET",
      url: `${CB_URL}/entities/${req.params.inventoryId}`,
      qs: {
        type: "InventoryItem",
        options: "keyValues"
      }
    }
  ];
  request(options[0], function(error, response, bodyInventory) {
    if (error) {
      next(error);
    } else {
      const inventory = JSON.parse(bodyInventory);
      const count = inventory.shelfCount - 1;
      options.push({
        method: "PATCH",
        url: `${CB_URL}/entities/${req.params.inventoryId}/attrs`,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ shelfCount: { type: "Integer", value: count } })
      });
      request(options[1], function(error) {
        if (error) {
          next(error);
        } else {
          res.redirect(`/app/store/${inventory.refStore}/till`);
        }
      });
    }
  });
}

module.exports = {
  buyItem,
  displayStores,
  displayTillInfo
};
