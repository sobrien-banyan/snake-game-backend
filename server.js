const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({path: "./config.env"});
const errorHandler = require('./_helpers/error-handler');
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
app.use(errorHandler);

const dbo = require("./db/conn");

app.listen(port, () => {
    dbo.connectToServer((err) => {
        if (err) console.error(err);
    });
    console.log(`Sever is running on port ${port}`);
});