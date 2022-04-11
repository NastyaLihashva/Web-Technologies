const express = require("express");
const multer  = require("multer");
const path = require("path");
const https = require("https");
const routerIndex = require("./routes/routerIndex");
const routerGallery = require("./routes/routerGallery"); 
const routerPaintings = require("./routes/routerPaintings");
const routerPaintingItem = require('./routes/routerPaintingItem');
const routerParticipants = require('./routes/routerParticipants');
const routerProperties = require('./routes/routerProperties');

const fs = require("fs");

const app = express();
app.use('/public', express.static(__dirname + '/public'));
app.set("view engine", "pug");
app.set("views", __dirname + `/views`);
app.use(express.json());

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, __dirname + '/public/img/paintings');
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storageConfig});
app.post("/upload", upload.single("img"), (req, res) => {
    let filedata = req.file;
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен");
});

app.use('/', routerIndex);
app.use('/gallery', routerGallery);
app.use('/paintingsList', routerPaintings);
app.use('/paintingsList', routerPaintingItem);
app.use('/participants', routerParticipants);
app.use('/properties', routerProperties);

const privateKey = fs.readFileSync('./server/ssl/example.key').toString();
const certificate = fs.readFileSync('./server/ssl/example.crt').toString();

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(3000);