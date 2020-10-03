# fiware_helloWorld

It has the following tutorials:

- [Core Context Management](https://fiware-tutorials.readthedocs.io/en/latest/getting-started/index.html):
	- Getting start
	- Relationships
	- Crud operations
	- Accesing context
	- Subscriptions

- [Persisting Context with Dracom - Nifi](https://fiware-tutorials.readthedocs.io/en/latest/historic-context-nifi/index.html):
	- With the same database used for orion, but it could be different.
	- To exploit data history connect to the database that draco uses.
	- Wait draco to initiate (docker ps)
	- You have to configurate draco with the template of the tutorial and START all the template
	- Take attentiton to throttling in subscription because it is the time where notifications are not send after a notification is send.
	- There are some configurations about how draco stores the entities see [documentation](https://fiware-draco.readthedocs.io/en/latest/processors_catalogue/ngsi_mongo_sink/index.html). In the tamplate tutorial uses **row** configuration, and the connection to the database is `mongodb://mongo-db:27017`


Para iniciar:

```shell
docker-compose up -d --build
# create entities, subscriptions (including Draco), etc.
./scripts/first.sh
```

# Server
Open http://localhost:3000/

# Draco
Open http://localhost:9090/nifi/

To watch the subscription events:
```shell
docker logs web-client-tutorial
```
To watch historical:
```shell
#connect to container
docker exec -it db-mongo-tutorial /bin/bash

#inside de container connect to mongo
mongo

#inside mongo database
show dbs
use sth_test
show collections
#for example
db["sth_/_urn:ngsi-ld:Store:001_Store"].find()
```