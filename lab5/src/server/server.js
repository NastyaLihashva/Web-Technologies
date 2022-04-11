const express = require("express");
const path = require("path");
const cors = require('cors');
const app = express();
const corsOptions = {
    'credentials': true,
    'origin': true,
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'allowedHeaders': 'Authorization,X-Requested-With,X-HTTPMethod-Override,Content-Type,Cache-Control,Accept',
}

const routerBrokers = require('./routers/routerBrokers');
const routerProperties = require('./routers/routerProperties');
const routerStocks = require('./routers/routerStocks');

app.use(cors(corsOptions));
app.use(express.json());

app.use('/brokers', routerBrokers); //для обновлений файлов
app.use('/properties', routerProperties);
app.use('/stocks', routerStocks);

app.listen(3000);
