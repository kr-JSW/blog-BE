const Post = require("../model/post");
const fs = require("fs");

const createPost = (req, res) => {
  const newPost = new Post(req.body);
  newPost.save();
  return res.status(200).json("게시글을 저장하였습니다.");
};

const getPost = async (req, res) => {
  const category = req.query.categories;

  const postId = req.query.postId;

  let posts;

  let array = [];

  if (category) {
    posts = await Post.find({ categories: category }).exec();
    posts.map((item) => {
      const { title, desc, photo, createdAt, _id } = item;

      let editItem = { title, desc, photo, createdAt, _id };
      array.push(editItem);
    });
    array.reverse();
  } else if (postId) {
    posts = await Post.findById(postId).exec();
    const { title, desc, photo } = posts;
    let editItem = { title, desc, photo };
    array.push(editItem);
  }

  return res.status(200).json(array);
};

const updatePost = async (req, res) => {
  const { title, desc, index, photo } = req.body;

  const update = await Post.findByIdAndUpdate({ _id: index }, req.body, {
    new: true,
  }).exec();

  return res.status(200).json({ message: "내용이 업데이트되었습니다." });
};

const postdelete = async (req, res) => {
  const id = req.query.id;
  const filename = req.query.filename;

  try {
    Post.deleteOne({ _id: id }).exec();
    try {
      fs.unlink(`../server/images/${filename}`, (err) =>
        console.log("이미지 파일이 삭제되었습니다.")
      );
    } catch {}
    return res.status(200).json("해당 게시물이 삭제되었습니다.");
  } catch {
    return res.status(200).json("게시글 삭제에 실패하였습니다.");
  }
};

module.exports = { createPost, getPost, updatePost, postdelete };
