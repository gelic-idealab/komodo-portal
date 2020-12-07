# Komodo Portal - Backend

[Learn more about the Komodo Platform](https://github.com/gelic-idealab/komodo-docs)

## What is it?
As a part of Komodo Portal, the backend served as a API to support the necessary data requested from the frontend and interacted with database to query the data. The backend is based on Node.js/Express. 

1. [Development](#development)
2. [Test](#test)
3. [Deployment](#deployment)

_______________
<a name="development"></a>
### Development
#### Getting started
Prerequisite:
* [Node.js](https://nodejs.org/en/download/)
* [MySQL workbench](https://dev.mysql.com/downloads/workbench/) (Recommend but not required)

1. Clone this repository
 ```bash
 git clone https://github.com/gelic-idealab/komodo-portal.git 
 cd komodo-portal/backend
 ```
2. Install dependencies
```bash
npm install
```
3. Run the server
```bash
node index.js
```

______________
<a name="test"></a>
### Test
The recommended Komodo test users `Postman`, more details can see [here](https://learning.postman.com/docs/getting-started/introduction/).

______________
<a name="deployment"></a>
### Deployment
The recommended Komodo deployment uses [Docker](https://www.docker.com/products/container-runtime) and docker-compose.  