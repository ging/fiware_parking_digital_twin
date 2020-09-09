# fiware_helloWorld

It has the following tutorials:

- Core Context Management:
	- Getting start
	- Relationships
	- Crud operations
	- Accesing context
	- Subscriptions


Para iniciar:

```shell
docker-compose up -d --build
# create entities, subscriptions, etc.
./scripts/first.sh
```

Open http://localhost:3000/

To watch the subscription events:
```shell
docker logs web-client-tutorial
```
