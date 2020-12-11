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
    "https://komodo-dev.library.illinois.edu",
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
