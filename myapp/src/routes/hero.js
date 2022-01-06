import express from 'express';
import createError from 'http-errors';
import config from '../config';

const router = express.Router();

const pgp = require('pg-promise')();
const env = process.env.NODE_ENV || 'development';
const db = pgp(config[env].database);

router.get('/email', (req, res) => {
  db.any('select * from testtable')
    .then((data) => {
      res.status(200).send(`user email: ${data[0].email}`);
    })
    .catch((error) => {
      res.status(502).send(error);
    });
});

// a middleware function with no mount path. this code is executed for every request to the router 
router.use((req, res, next) => {
  console.log(`Time: ${Date.now()}`);
  next();
});

// a middleware sub-stack that shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next();
}, (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next router
  if (req.params.id == 0) next('route');
  // otherwise pass control to the next middleware function in this stack
  else next(); //
}, (req, res) => {
  // render a regular page
  res.send('regular');
});

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', (req, res) => {
  console.log(req.params.id);
  res.send('special');
});

router.get('/', (req, res) => {
  res.send('hello, world!');
});

router.get('/:id', (req, res) => {
  res.send(`Your id is ${req.params.id}!`);
});

router.get('/:name', (req, res) => {
  res.send(`Your name is ${req.params.name}!`);
});

// route handler chaining
router.route('/team')
  .get((req, res) => {
    res.send('team get');
  })
  .post((req, res) => {
    res.json({ method: 'post', key: 'value' });
  })
  .put((req, res) => {
    res.sendStatus(200);
  });

router.use((req, res, next) => {
  console.log('error creation');
  next(createError(404));
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  console.log(`error handling: ${err.status}, ${err.message}`);
  res.status(err.status).send(err.message);
});

export default router;
