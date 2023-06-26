const express = require('express');
const dotenv  = require('dotenv').config();
const connectdb = require('./config/dbConnection')
const passport = require('passport');
require('./middleware/passport.js');

const app = express();
connectdb();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize()); 

app.use("/", require("./routers/routes"));

app.listen(port, () => {
    console.log( `server listening on port ${port}`);
});
