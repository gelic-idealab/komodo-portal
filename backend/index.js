const mysql = require('mysql2');
const config = require("./config");
const aws = require("./aws");
const cookieParser = require('cookie-parser');

// create the connection to database
const pool = mysql.createPool({
  ...config.mysql,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = config.web.port;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors({
  origin: [
    "https://vr.komodo-dev.library.illinois.edu",
    "http://localhost",
    "https://localhost",
    "https://komodo-dev.library.illinois.edu",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8080",
    "https://localhost:8080"
  ],
  methods: [
    'GET', 'PUT', 'POST', 'DELETE'
  ],
  credentials: true,
}));

app.use(session({
  secret: config.web.session_secret,
  resave: false,
  saveUninitialized: true
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const {
  userController,
  courseController,
  labController,
  assetController,
  publicController,
  dataController
} = require("./controller");

app.use("/users", userController);
app.use("/courses", courseController);
app.use("/labs", labController);
app.use("/assets", assetController);
app.use("/data", dataController);
app.use("/public", publicController);

const ExampleConfig = {};


app.get('/', (req, res) => res.send('Hello Komodo!'));
app.post('/register', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    res.end(JSON.stringify({success: false, errorMessage: "illegal request"}));
    return;
  }
  const config = {
    ...ExampleConfig,
    email: email,
  };
  pool.execute("INSERT INTO user (email, password, config) values (?, SHA(?), ?);",
    [email, password, JSON.stringify(config)], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.end(JSON.stringify({success: false, errorMessage: "email already registered"}));
        } else {
          res.end(JSON.stringify({success: false, errorMessage: err.toString()}));
        }
      } else {
        req.session.config = config;

        res.end(JSON.stringify({success: true}));
      }
    });
});

app.get('/config', (req, res) => {
  if (!req.session.config) {
    res.end(JSON.stringify({success: false, errorMessage: "not login"}));
  }
  res.end(JSON.stringify({success: true, data: JSON.stringify(req.session.config)}));
});
app.post('/config', (req, res) => {
  const {config} = req.body;
  if (!req.session.config) {
    res.end(JSON.stringify({success: false, errorMessage: "not login"}));
  }
  if (!config) {
    res.end(JSON.stringify({success: false, errorMessage: "illegal request"}));
    return;
  }
  pool.execute("UPDATE user SET config = ? WHERE email = ?",
    [JSON.stringify(config), req.session.config.email], (err) => {
      if (err) {
        console.log(err);
        req.session.config = config;
        res.end(JSON.stringify({success: false, errorMessage: err.toString()}));
      } else {
        res.end(JSON.stringify({success: true}));
      }
    });
});

app.get('/s3_signed/:name', (req, res) => {
  const name = req.params.name;
  if (!name || !/^[a-zA-Z0-9_]+$/.test(name)) {
    console.log(name);
    res.end(JSON.stringify({success: false, errorMessage: "illegal name, can only use A-Za-z0-9_"}));
  }
  aws.createPresignedPost(name, (err, data) => {
    if (err) {
      res.end(JSON.stringify({success: false, errorMessage: err.toString()}));
    } else {
      res.end(JSON.stringify({success: true, data: data}));
    }
  })
});


app.listen(port, () => console.log(`Komodo portal backend listening on port ${port}!`));
