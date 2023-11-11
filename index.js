const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();
const controller = require('./controller/index');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

try {
    fs.readdirSync('images');
} catch (err) {
    console.error('images 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('images');
}

const app = express();

app.use(cookieParser());

app.use('/images', express.static(path.join(__dirname, '/images')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/images'));
    },
    filename: function (req, file, cb) {
        console.log('파일이름이다 : ', req.body.name);
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });

let whitelist = [process.env.FRONTURL, process.env.FRONTURL_TWO];

app.use(
    cors({
        origin: function (origin, callback) {
            if (typeof origin !== undefined || whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },

        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded());

app.use(`/api`, controller);

app.post(`/api/upload`, upload.single('file'), (req, res) => {
    return res.status(200).json('파일이 업로드되었습니다.');
});

main()
    .then((res) => console.log('mongoDB가 연결되었습니다!'))
    .catch((err) => console.log('연결에러 : ', err));

async function main() {
    await mongoose.connect(process.env.MONGO_DB);
}

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(` ${port}번 포트에 서버가 연결되었습니다.`);
});
