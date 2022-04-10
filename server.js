const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
const routes = require('./src/routes');
const port = config.get('port');

app.use(cors());
app.use(express.json());

app.listen(process.env.port || 8020, async function() {
    console.log(process.env)
    console.log(`ARPHIE API is running::${process.env.port}`)
    routes(app);
});