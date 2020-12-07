# Komodo Portal

[Learn more about the Komodo Platform](https://github.com/gelic-idealab/komodo-docs)

## What is it?
Komodo Portal is a web service for instructors to deploy social virtual reality education apps. Instructors can easily deploy a classroom session, manage sessions and upload assets. Students can join in the classroom session to receive the instruction. This repo contains both backend and frontend. The frontend provides web views for users to interact, while the backend served as a API to support the necessary data requested from the frontend. 

1. [Development](#development)
2. [Deployment](#deployment)

_______________
<a name="development"></a>
### Development
#### Getting started
Prerequisite:
* [Node.js](https://nodejs.org/en/download/)
* vue/cli installed by `npm install -g @vue/cli-service-global`
* [MySQL workbench](https://dev.mysql.com/downloads/workbench/) (Recommend but not required)

Clone this repository
 ```bash
 git clone https://github.com/gelic-idealab/komodo-portal.git 
 cd komodo-portal/
 ```

This repo contains two parts: frontend and backend. You need to set up these two parts seperatively and run them on different port. 

1. Frontend
Visit [here] to get more details about the frontend.
2. Backend
Visit [here] to get more details about the backend.

______________
<a name="deployment"></a>
### Deployment
The recommended Komodo deployment uses [Docker](https://www.docker.com/products/container-runtime) and docker-compose.  
