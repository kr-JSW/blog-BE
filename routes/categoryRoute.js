const categoryModel = require('../model/categories');
const postModel = require('../model/post');

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

const delCategory = (req, res) => {
    const { value } = req.body;
    categoryModel.findOneAndDelete({ name: value }).exec();
    postModel.deleteMany({ categories: value }).exec();

    return res.status(200).json({ answer: '카테고리가 삭제되었습니다.' });
};

module.exports = { createCategory, getCategory, delCategory };
