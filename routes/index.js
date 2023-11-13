const posts = require('../controller/postCon');
const router = require('express').Router();
const userRoute = require('../controller/userCon');
const codeRoutes = require('../controller/codeCon');
const categoryRoutes = require('../controller/categoryCon');

router.post('/posts/createPost', posts.createPost);

router.get('/posts/getPost', posts.getPost);

router.put('/posts/updatePost', posts.updatePost);

router.delete('/posts/postdelete', posts.postdelete);

router.post('/user/signup', userRoute.signup);

router.post('/user/signin', userRoute.signin);

router.post('/user/tokenAuth', userRoute.tokenAuth);

router.post('/user/logout', userRoute.logout);

router.post('/user/mypage', userRoute.mypage);

router.post('/user/profileImgUpdate', userRoute.profileImgUpdate);

router.patch('/user/editpwd', userRoute.editpwd);

router.delete('/user/withdraw', userRoute.withdraw);

router.patch('/user/grade', userRoute.grade);

router.get('/user/getuser', userRoute.getuser);

router.get('/code/createCode', codeRoutes.createCode);

router.get('/code/getCode', codeRoutes.getCode);

router.delete('/code/delCode', codeRoutes.delCode);

router.post('/categories/createCategory', categoryRoutes.createCategory);

router.get('/categories/getCategory', categoryRoutes.getCategory);

router.delete('/categories/delCategory', categoryRoutes.delCategory);

module.exports = router;
