const codeModel = require("../model/code");

const createCode = (req, res) => {
  let code = new codeModel();

  code.save().then(() => {
    return res.status(200).json({ answer: "코드가 생성되었습니다." });
  });
};

const getCode = async (req, res) => {
  let allCode = await codeModel.find().exec();

  let arr = [];

  allCode.map((i) => {
    const { code, _id } = i;
    arr.push({ code: i.code, id: _id });
  });

  return res.status(200).json({ allCode: arr });
};

const delCode = (req, res) => {
  let codeId = req.body.id;

  codeModel.findOneAndDelete({ _id: codeId }).exec();

  return res.status(200).json({ answer: "코드가 삭제되었습니다." });
};

module.exports = { createCode, getCode, delCode };
