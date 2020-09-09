# sin los data model orion permite cualquier cosa al definir el modelo, por ejemplo en geo:json point un string
# al igual que antes las relaciones es un convencionalismo, en realidad puedes ponerlo a algo que no exista como la shelf 5 que esta con store 3
# es no relacional, al borrar debes borrar tambien las relaicones de la entidad que borras para no ser inconsistente
# las operaciones del crud verlo en la documentacion, son todas llamadas con curl
# buscar en la documentacion de ngsi-v2 como hacer un delete en cascada
echo 'Get Version'
echo '============='
curl -X GET \
  'http://localhost:1026/version' \
  | json_pp

echo ''
echo ''

echo 'Creating store entities'
echo '============='
curl -iX POST \
  'http://localhost:1026/v2/op/update' \
  -H 'Content-Type: application/json' \
  -d '{
  "actionType": "append",
  "entities": [
    {
    	"type": "Store",
    	"id": "urn:ngsi-ld:Store:001",
    	"address": {
        	"type": "PostalAddress",
        	"value": {
            	"streetAddress": "Bornholmer Straße 65",
            	"addressRegion": "Berlin",
            	"addressLocality": "Prenzlauer Berg",
            	"postalCode": "10439"
	        }
	    },
	    "location": {
	        "type": "geo:json",
	        "value": {
	           "type": "Point",
	           "coordinates": [13.3986, 52.5547]
	        }
	    },
    	"name": {
        	"type": "Text",
        	"value": "Bösebrücke Einkauf"
    	}
    },
    {
    	"type": "Store",
        "id": "urn:ngsi-ld:Store:002",
	    "address": {
	        "type": "PostalAddress",
	        "value": {
	            "streetAddress": "Friedrichstraße 44",
	            "addressRegion": "Berlin",
	            "addressLocality": "Kreuzberg",
	            "postalCode": "10969"
	        }
	    },
	    "location": {
	        "type": "geo:json",
	        "value": {
	             "type": "Point",
	             "coordinates": [13.3903, 52.5075]
	        }
	    },
	    "name": {
	        "type": "Text",
	        "value": "Checkpoint Markt"
	    }
    }
  ]
}'

echo ''
echo ''

echo 'Creating shelf entities'
echo '============='
curl -iX POST \
  'http://localhost:1026/v2/op/update' \
  -H 'Content-Type: application/json' \
  -d '{
  "actionType":"APPEND",
  "entities":[
    {
      "id":"urn:ngsi-ld:Shelf:unit001", "type":"Shelf",
      "location":{
        "type":"geo:json", "value":{ "type":"Point","coordinates":[13.3986112, 52.554699]}
      },
      "name":{
        "type":"Text", "value":"Corner Unit"
      },
      "maxCapacity":{
        "type":"Integer", "value":50
      }
    },
    {
      "id":"urn:ngsi-ld:Shelf:unit002", "type":"Shelf",
      "location":{
        "type":"geo:json","value":{"type":"Point","coordinates":[13.3987221, 52.5546640]}
      },
      "name":{
        "type":"Text", "value":"Wall Unit 1"
      },
      "maxCapacity":{
        "type":"Integer", "value":100
      }
    },
    {
      "id":"urn:ngsi-ld:Shelf:unit003", "type":"Shelf",
      "location":{
        "type":"geo:json", "value":{"type":"Point","coordinates":[13.3987221, 52.5546640]}
      },
      "name":{
        "type":"Text", "value":"Wall Unit 2"
      },
      "maxCapacity":{
        "type":"Integer", "value":100
      }
    },
    {
      "id":"urn:ngsi-ld:Shelf:unit004", "type":"Shelf",
      "location":{
        "type":"geo:json", "value":{"type":"Point","coordinates":[13.390311, 52.507522]}
      },
      "name":{
        "type":"Text", "value":"Corner Unit"
      },
      "maxCapacity":{
        "type":"Integer", "value":50
      }
    },
    {
      "id":"urn:ngsi-ld:Shelf:unit005", "type":"Shelf",
      "location":{
        "type":"geo:json","value":{"type":"Point","coordinates":[13.390309, 52.50751]}
      },
      "name":{
        "type":"Text", "value":"Long Wall Unit"
      },
      "maxCapacity":{
        "type":"Integer", "value":200
      }
    }
  ]
}'

echo ''
echo ''

echo 'Creating product entities'
echo '============='
curl -iX POST \
  'http://localhost:1026/v2/op/update' \
  -H 'Content-Type: application/json' \
  -d '{
  "actionType":"APPEND",
  "entities":[
    {
      "id":"urn:ngsi-ld:Product:001", "type":"Product",
      "name":{
        "type":"Text", "value":"Beer"
      },
      "size":{
        "type":"Text", "value": "S"
      },
      "price":{
        "type":"Integer", "value": 99
      }
    },
    {
      "id":"urn:ngsi-ld:Product:002", "type":"Product",
      "name":{
        "type":"Text", "value":"Red Wine"
      },
      "size":{
        "type":"Text", "value": "M"
      },
      "price":{
        "type":"Integer", "value": 1099
      }
    },
    {
      "id":"urn:ngsi-ld:Product:003", "type":"Product",
      "name":{
        "type":"Text", "value":"White Wine"
      },
      "size":{
        "type":"Text", "value": "M"
      },
      "price":{
        "type":"Integer", "value": 1499
      }
    },
    {
      "id":"urn:ngsi-ld:Product:004", "type":"Product",
      "name":{
        "type":"Text", "value":"Vodka"
      },
      "size":{
        "type":"Text", "value": "XL"
      },
      "price":{
        "type":"Integer", "value": 5000
      }
    }
  ]
}'

echo ''
echo ''

echo 'Creating relationships 1 to N'
echo '============='
curl -iX POST \
  'http://localhost:1026/v2/op/update' \
  -H 'Content-Type: application/json' \
  -d '{
  "actionType":"APPEND",
  "entities":[
    {
      "id":"urn:ngsi-ld:Shelf:unit001", "type":"Shelf",
      "refStore": {
        "type": "Relationship",
        "value": "urn:ngsi-ld:Store:001"
      }
    },
    {
      "id":"urn:ngsi-ld:Shelf:unit002", "type":"Shelf",
      "refStore": {
        "type": "Relationship",
        "value": "urn:ngsi-ld:Store:001"
      }
    },
    {
      "id":"urn:ngsi-ld:Shelf:unit003", "type":"Shelf",
      "refStore": {
        "type": "Relationship",
        "value": "urn:ngsi-ld:Store:001"
      }
    },
    {
      "id":"urn:ngsi-ld:Shelf:unit004", "type":"Shelf",
      "refStore": {
        "type": "Relationship",
        "value": "urn:ngsi-ld:Store:002"
      }
    },
    {
      "id":"urn:ngsi-ld:Shelf:unit005", "type":"Shelf",
      "refStore": {
        "type": "Relationship",
        "value": "urn:ngsi-ld:Store:003"
      }
    }
  ]
}'

echo ''
echo ''
echo 'Get shelfs from store 001'
echo '============='
curl -G -X GET \
  'http://localhost:1026/v2/entities' \
  -d 'q=refStore==urn:ngsi-ld:Store:001' \
  -d 'options=count' \
  -d 'attrs=type' \
  -d 'type=Shelf'

echo ''
echo ''
echo 'Get shelfs from store 003 that not exists'
echo '============='
curl -G -X GET \
  'http://localhost:1026/v2/entities' \
  -d 'q=refStore==urn:ngsi-ld:Store:003' \
  -d 'options=count' \
  -d 'attrs=type' \
  -d 'type=Shelf'


echo ''
echo ''
echo 'N to N to N  relationship between store, shelf and product crating a new entity'
curl -iX POST \
  'http://localhost:1026/v2/entities' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 0588ef62-6b5c-4d1b-8066-172d63b516fd' \
  -d '{
    "id": "urn:ngsi-ld:InventoryItem:001", "type": "InventoryItem",
    "refStore": {
        "type": "Relationship",
        "value": "urn:ngsi-ld:Store:001"
    },
    "refShelf": {
        "type": "Relationship",
        "value": "urn:ngsi-ld:Shelf:unit001"
    },
    "refProduct": {
        "type": "Relationship",
        "value": "urn:ngsi-ld:Product:001"
    },
    "stockCount":{
        "type":"Integer", "value": 10000
    },
    "shelfCount":{
        "type":"Integer", "value": 50
    }
}'

echo ''
echo ''
echo 'Get store where is product 001'
echo '============='
curl -G -X GET \
  'http://localhost:1026/v2/entities' \
  -d 'q=refProduct==urn:ngsi-ld:Product:001' \
  -d 'options=values' \
  -d 'attrs=refStore'\
  -d 'type=InventoryItem'

echo ''
echo ''
echo 'Get all relations where store 001 appears. If you want to delete store 001 delete its relationships too.'
echo '============='
curl -G -X GET \
  'http://localhost:1026/v2/entities' \
  -d 'q=refStore==urn:ngsi-ld:Store:001' \
  -d 'options=count' \
  -d 'attrs=type' \
  | json_pp


  
