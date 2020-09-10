# fiware_helloWorld

## It has the following tutorials:

- Core Context Management:
	- Getting start
	- Relationships
	- Crud operations
	- Accesing context
	- Subscriptions

- Identity Management:
    - Administrating Users
    - Managing Roles and Permissions

### Entities IDM:

- User - Any signed up user able to identify themselves with an eMail and password. Users can be assigned rights individually or as a group
- Application - Any securable FIWARE application consisting of a series of microservices. The stores, there are one or more **admins**
- Organization - A group of users who can be assigned a series of rights. Altering the rights of the organization effects the access of all users of that organization (organization of security and organizaton of managers).
- OrganizationRole - Users can either be **members or admins (delegates of app admins)** of an organization - Admins are able to add and remove users from their organization, members merely gain the roles and permissions of an organization. This allows each organization to be responsible for their members and removes the need for a super-admin to administer all rights
- Role - A role is a descriptive bucket for a set of permissions. A role can be assigned to either a single user or an organization. A signed-in user gains all the permissions from all of their own roles plus all of the roles associated to their organization
- Permission - An ability to do something on a resource within the system

#### Users (email | password):

- Admin of the system in .env (alice-the-admin@test.com | test)
- Alice, she will be the Administrator of one Keyrock Application (alice-the-admin@test.com | test)
- Bob, organization admin (bob-the-manager@test.com), the Regional Manager of the supermarket chain - he has several store managers under him:
    - Manager1 (manager1@test.com | test)
    - Manager2 (manager1@test.com | test)
- Charlie, organization admin (charlie-security@test.com | test), the Head of Security of the supermarket chain - he has several store detectives under him:
    - Detective1 (detective1@test.com | test)
    - Detective2 (detective2@test.com | test)
- Other persons, intruses:
    - Eve (eve@example.com | test)
    - Mallory (mallory@example.com | test)
    - Rob (rob@example.com | test)

**Note** - an eMail server must be configured to send out invites properly, otherwise the invitation may be deleted as spam. For testing purposes, it is easier to update the users table directly: `mysql -u <user> -p<password> idm` and `update user set enabled = 1;` Or you can use a real account but search in spam section.

#### Organizations:
- Security (alice (owner), charlie (owner), detective1, detective2)
- Management (alice (owner), bob (owner), manager1, manager2)

## To start:

```shell
# remove volume to charge the backup.sql
docker-compose -p fiware-tutorial down --volume --remove-orphans
docker-compose -p fiware-tutorial up -d --build
# create entities, subscriptions, etc.
./scripts/first.sh
```

Open http://localhost:3000/
Open http://localhost:3005/ (idm)

To watch the subscription events:
```shell
docker logs web-client-tutorial
```
