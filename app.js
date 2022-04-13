// const http = require("http");

// http
//   .createServer(function(request, response) {
//     console.log("request received");
//     response.end("omg hi!....", "utf-8");
//   })
//   .listen(3000);
// console.log("server started");


require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const algoliasearch = require('algoliasearch');
const jwt = require('jsonwebtoken');

// Algolia
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API);
const index = client.initIndex('itsallfoodthings2');

// Modules
const { recipe } = require('./modules/recipe.js');
const Recipe = new recipe(pool, index);
const { category } = require('./modules/category.js');
const Category = new category(pool, index);
const { algoliaIndex } = require('./modules/algolia-index.js');
const AlgoliaIndex = new algoliaIndex(pool, index, Recipe);

// Utils
const { verifyUser } = require('./utils/auth.js');
const cookieParser = require('cookie-parser');

const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
  res.send('TEST...');
});

app.post('/api/login', async (req, res) => {
  const password = req.body.password;
  if (password === process.env.API_PASSWORD) {
    const accessToken = jwt.sign({ user: 'dan'}, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
  } else {
    res.send(500, { error: 'Not authorised' });
  }
});

app.get('/api/recipe/:id', async (req, res) => {
  try {
    const data = await Recipe.one(req.params['id']);
    res.send(data.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

app.get('/api/recipe/delete/:id', [ verifyUser ], async (req, res) => {
  try {
    const data = await Recipe.delete(req.params['id']);
    AlgoliaIndex.delete(req.params['id']);
    res.send(200);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    const data = await Recipe.all();
    res.send(data.rows);
  } catch (error) {
    console.log(error);
  }
});

app.get('/api/sync', [ verifyUser ],  async (req, res) => {
  try {
    await AlgoliaIndex.syncAll();
    res.send('Done!');
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post('/api/recipes/create', [ verifyUser ], async (req, res) => {
  try {
    const newRecipeID = await Recipe.create(req.body);
    AlgoliaIndex.add(newRecipeID);
    res.sendStatus(200);
  } catch (error) {
    res.send(500, { error: error.message });
  }
});

app.post('/api/recipe/edit/:id', [ verifyUser ], async (req, res) => {
  try {
    await Recipe.update(req.body);
    console.log(req.body)
    AlgoliaIndex.update(req.body.id)
    res.sendStatus(200);
  } catch (error) {
    res.send(500, { error: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const data = await Category.all(req.body);
    const formatted = data.map((cat) => (
      {
        category: cat.rows[0].category,
        rows: cat.rows
      }
    ));
    res.send(formatted);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post('/api/categories/create', [ verifyUser ], async (req, res) => {
  try {
    const data = await Category.create(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

