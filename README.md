# Task-manager-api

A backend service created using NodeJS & ExpressJS that allows you create users and also create tasks for each user.

The API's use JWT based authentication that makes sure that the user can only view/edit the tasks that only he created.

## API endpoints :-

### Users:

1. POST: /users
2. POST: /users/login
3. GET: /users/me
4. PATCH: /users/me
5. POST: /users/logout
6. POST: /users/logoutAll
7. DELETE: /users/me

### Tasks:

1. POST: /tasks
2. GET: /tasks
3. GET: /tasks/:id
4. PATCH: /tasks/:id
5. DELETE: /tasks/:id

## Usage

Install all the packages present in package.json
```
npm install
```
Run the dev script
```
npm run dev
```

## POSTMAN collection 

Download the POSTMAN collection from [here](https://drive.google.com/file/d/1B45xBf_-eNyuoGyN1NqD5wZjnybMIecd/view?usp=sharing)

### Environments

There are two environments in the collection:
1. Task-Manager-API (Dev)
2. Task-Manager-API (Prod)

The dev env uses the localhost link while the Prod env uses the heroku link where the API is deployed.

A variable "url" is created in each of the environment so that there is no need to hardcode the url in every request.

If you want to change the url then follow the below steps:

* Open the Environments tab in your collection
* Paste your url against the global variable "url"

NOTE:- The Auth token is generated whenever a new user is created or an user logs in. In order to mock the API's there is no need to copy the Auth token rather an automated script automatically picks the latest bearer authentication token.

## Technologies

* NodeJS
* ExpressJS
* MongoDB
* JWT
