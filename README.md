<!-- omit in toc -->
# REST API

This module was established to learn `REST API` basic principles. The project contains app written in `TypeScript`, unit tests and integration tests.

<br>

<!-- omit in toc -->
## Table of Contents
- [Description](#description)
- [Usage](#usage)

<br>

## Description
The `Task Manager REST API` may be used by frontend applications to manage everyday tasks. All endpoints are documented with `Swagger` and can be found at http://localhost:4001/api-docs/ after running the application in `docs` mode.
<br>

## Usage
In the production application connect to `MongoDB Atlas`. In the development mode it  uses a `MongoDB` database started on the localhost. Thus, you need to [download](https://www.mongodb.com/try/download/community) and install `MongoDB`. All necessary configurations for transpilation and testing you will find in `tsconfig.json` and `package.json`, respectively.
For testing `Thunder Client` can be also used. In the root folder you can find `thunder-collection_restapi.json` and `thunder-environment_variables.json`

Tu use the library you can clone the repository and install all dependencies with command
```console
npm install
```
Project contains several predefined scripts which can be initialized with `npm run` and:</br>
`build` : to transpile `TypeScript` to `JavaScript` </br>
`start` : to start the server in the production </br>
`dev` : to start server in development mode </br>
`test` : to start all tests test </br>
`docs` : to start building API documentation on the localhost. </br>

Important: `docs` command will also run all tests.

Examples: 
```console
npm run build
```
```console
npm run docs
```






