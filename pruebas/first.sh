#sin los data model orion permite cualquier cosa al definir el modelo, por ejemplo en geo:json point un string
echo 'Get Version'
echo '============='
curl -X GET \
  'http://localhost:1026/version' \
  | json_pp

echo ''
echo ''

echo 'Create entity'
echo '============='
curl -iX POST \
  'http://localhost:1026/v2/entities' \
  -H 'Content-Type: application/json' \
  -d '
{
    "id": "urn:ngsi-ld:Store:001",
    "type": "Store",
    "address": {
        "type": "PostalAddress",
        "value": {
            "streetAddress": "Bornholmer Straße 65",
            "addressRegion": "Berlin",
            "addressLocality": "Prenzlauer Berg",
            "postalCode": "10439"
        },
        "metadata": {
            "verified": {
                "value": true,
                "type": "Boolean"
            }
        }
    },
    "location": {
        "type": "geo:json",
        "value": {
             "type": "Point",
             "coordinates": [13.3986, 52.5547, "hola"]
        }
    },
    "name": {
        "type": "Text",
        "value": "Bösebrücke Einkauf"
    }
}'
echo ''
echo ''

echo 'Get entity'
echo '============='
curl -G -X GET \
   'http://localhost:1026/v2/entities/urn:ngsi-ld:Store:001' \
   -d 'options=keyValues' \
   | json_pp

