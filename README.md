<!-- omit in toc -->
# REST API

This module was established to learn `REST API` basic principles. The project contains app written in `TypeScript`, unit tests and integration tests.

<br>

<!-- omit in toc -->
## Table of Contents
- [Description](#description)
- [Instalations](#instalations)
- [Usage](#usage)
- [Folder structure](#folder-structure)
## Description
The `Task Manager REST API` may be used by frontend applications to manage everyday tasks. All endpoints are documented with `Swagger` and can be found at http://localhost:4001/api-docs/ after running the application in [docs](#docs) mode.
<br>

## Instalations 
Tu use the library you can clone the repository and install all dependencies.

```bash
git clone https://github.com/konrad-winnicki/rest-api
```

```bash
npm install
```
In the production, application connect to `MongoDB Atlas`. In the development mode it uses a `MongoDB` database started on the localhost. Thus, to use dev mode you need to [download](https://www.mongodb.com/try/download/community) and install `MongoDB`. All necessary configurations for transpilation and testing you will find in `tsconfig.json` and `package.json`, respectively.

## Usage

Project contains several predefined scripts which can be initialized with `npm run` and:</br>
```build``` : to transpile `TypeScript` to `JavaScript` </br>
```start``` : to start the server in the production </br>
```dev``` : to start server in development mode </br>
```test``` : to start all tests test </br>
```docs``` : to start building API documentation on the localhost. </br>

Important: `docs` command will also run all tests.

Example: 

```console
npm run docs
```

For testing `Thunder Client` can be also used. In the root folder you can find `thunder-collection_restapi.json` and `thunder-environment_variables.json`
## Folder structure

```
src/
│   app.ts
│   startServer.ts
│   tree.txt
│   
├───Common
│   └───Infrastructure
│       │   DatabaseConnector.ts
│       │   dependencias.ts
│       │   ErrorHandler.ts
│       │   HttpResponse.ts
│       │   
│       └───Middlewere
│               userAuthorizer.ts
│               
├───Task
│   ├───Application
│   │       TaskRepositoryInterface.ts
│   │       TaskService.ts
│   │       
│   ├───Domain
│   │       InputTask.ts
│   │       Task.ts
│   │       TaskSorter.ts
│   │       
│   └───Infrastructure
│           MongoTaskRepository.ts
│           taskControllers.ts
│           v1taskRouter.ts
│           
├───User
│   ├───Application
│   │       UserRepositoryInterface.ts
│   │       UserService.ts
│   │       
│   ├───Domain
│   │       InputUser.ts
│   │       User.ts
│   │       
│   └───Infrastructure
│           MongoUserRepository.ts
│           userControllers.ts
│           v1userRouter.ts
│           
└───__tests__
        api.test.ts
        InputTask.test.ts
        InputUser.test.ts
        Task.test.ts
        TaskSorter.test.ts
       


```








