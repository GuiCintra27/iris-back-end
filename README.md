# Íris API

API for Iniciativa Íris.

The website is available at: https://iniciativa-iris.vercel.app/

## About

This API serves the [iris-front-end](https://github.com/GuiCintra27/iris-front-end#iniciativa-%C3%ADris).\
Below are the implemented features:

- REST API
- OAuth
- Authenticated and unauthenticated routes
- More than 150 tests

## Technologies

The following tools and frameworks were used in the construction of the project: <br/>

<div style="display: inline_block"> 
   <img align="center" alt="Gui-Ts" height="30" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
   <img align="center" alt="Gui-PostgreSQL" height="30" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white">
   <img align="center" alt="Gui-NodeJs" height="30" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
   <img align="center" alt="Gui-ExpressJs" height="30" src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge">
   <img align="center" alt="Gui-Jest" height="30" src="https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white">
   <img align="center" alt="Gui-Git" height="30" src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white">
   <img align="center" alt="Gui-Trello" height="30" src="https://img.shields.io/badge/Trello-0052CC?style=for-the-badge&logo=trello&logoColor=white">
  <img align="center" alt="Gui-Notion" height="30" src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white">
</div>

## How to run

1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Create a PostgreSQL database with whatever name you want
4. Configure the `.env.development` file using the `.env.example`
5. Run all migrations

```bash
npm run migration:run
```

6. Seed db

```bash
npm run dev:seed
```

7. Run the back-end in a development environment:

```bash
npm run dev
```

8. You can optionally build the project running

```bash
npm run build
npm start
```

## How to run tests

1. Follow the steps in the last section
2. Configure the `.env.test` file using the `.env.example` file
3. Run all migrations

```bash
npm run test:migration:run
```

4. Seed the test database

```bash
npm run test:seed
```

5. Run test

```bash
npm run test
```
