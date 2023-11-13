const categoryModel = require('../model/categories');
const postModel = require('../model/post');
const fs = require('fs');

function checkUrl(photoName) {
    let expUrl = /^http[s]?:\/\/([\S]{3,})/i;
    return expUrl.test(photoName);
}

const createCategory = (req, res) => {
    const { name, photo } = req.body;

    const category = new categoryModel({ name, photo });

    category.save();

    return res.status(200).json({ answer: '카테고리 생성' });
};

const getCategory = async (req, res) => {
    const list = await categoryModel.find().exec();

    let arr = [];

    list.map((i) => {
        const { name, photo } = i;
        arr.push({ name, photo });
    });

    return res.status(200).json({ answer: arr });
};

const delCategory = async (req, res) => {
    const { value } = req.body;
    let delFile = await categoryModel.findOneAndDelete({ name: value }).exec();
    let manyDelFile = await postModel.find({ categories: value }).exec();
    await postModel.deleteMany({ categories: value }).exec();

    delFile = checkUrl(delFile.photo) ? null : delFile;
    console.log('manyDelFile : ', manyDelFile);
    try {
        fs.unlink(`./images/${delFile.photo}`, (err) => {
            console.log('카테고리 이미지 삭제 err : ', err);
        });
    } catch {}
    manyDelFile.map((i) => {
        const { photo } = i;
        if (!checkUrl(photo)) {
            try {
                fs.unlink(`./images/${photo}`, (err) => {
                    console.log('게시글 이미지 삭제 err : ', err);
                });
            } catch {}
        }
    });

    return res.status(200).json({ answer: '카테고리가 삭제되었습니다.' });
};

module.exports = { createCategory, getCategory, delCategory };
