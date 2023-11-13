const User = require('../model/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const codeModel = require('../model/code');

const signup = async (req, res) => {
    const { name, pwd, code } = req.body;

    let user = new User({ nickname: name, hashedPassword: pwd });

    let codeCheck = await codeModel.findOneAndDelete({ code }).exec();

    if (codeCheck === null) {
        return res.status(200).json('가입 코드가 올바르지 않습니다.');
    }

    user.save()
        .then(() => {
            console.log('성공');
            return res.status(200).json('signup sucess');
        })
        .catch(() => {
            console.log('실패');
            return res.status(200).json('signup failed');
        });
    return;
};

const signin = async (req, res) => {
    const { name, pwd } = req.body;

    let client = await User.findOne({ nickname: name }).exec();

    if (client === null) {
        return res.status(200).json({ answer: '존재하지 않는 유저입니다.' });
    } else if (await client.checkPwd(pwd)) {
        const { nickname, role, photo } = client;
        let privateKey = process.env.PRIVATE_KEY;
        jwt.sign({ nickname, role, photo }, privateKey, { algorithm: 'HS512', expiresIn: '2h' }, (err, token) => {
            if (err) {
                console.log('tok err : ', err);
            } else {
                res.cookie('loginToken', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                return res.status(200).json({ answer: nickname, photo, role });
            }
        });
    } else {
        return res.status(200).json({ answer: '아이디와 패스워드가 일치하지 않습니다.' });
    }
};

const tokenAuth = (req, res) => {
    let token = req.cookies.loginToken;
    let privateKey = process.env.PRIVATE_KEY;

    jwt.verify(token, privateKey, (err, decode) => {
        return res.status(200).json(decode);
    });
};

const logout = (req, res) => {
    res.cookie('loginToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    return res.status(200).json('로그아웃');
};

const mypage = (req, res) => {
    let token = req.body.token;
    let privateKey = process.env.PRIVATE_KEY;

    jwt.verify(token, privateKey, async (err, decode) => {
        try {
            const { nickname } = decode;

            let user = await User.findOne({ nickname }).exec();

            const { role } = user;

            return res.status(200).json({ data: role });
        } catch {
            console.log('토큰 에러 : ', err);
            return res.status(200).json({ data: false });
        }
    });
};

const profileImgUpdate = async (req, res) => {
    const { photo, name } = req.body;
    let privateKey = process.env.PRIVATE_KEY;

    let prevToken = req.cookies.loginToken;
    let prevFilename;

    jwt.verify(prevToken, privateKey, (err, decode) => {
        const { photo: prevPhoto } = decode;
        prevFilename = prevPhoto;
    });

    try {
        fs.unlink(__dirname + `/../images/${prevFilename}`, (err) => {
            if (err) {
                console.log('이미지 파일 삭제 err : ', err);
            }
            console.log('이미지 파일이 삭제되었습니다.');
        });
    } catch {
        console.log('왜 삭제가 안될까', prevFilename);
    }

    let user = await User.findOneAndUpdate({ nickname: name }, { photo }, { new: true }).exec();

    const { nickname: updateNickname, role: updateRole, photo: updatePhoto } = user;

    jwt.sign(
        { nickname: updateNickname, role: updateRole, photo: updatePhoto },
        privateKey,
        { algorithm: 'HS512', expiresIn: '1h' },
        (err, token) => {
            if (err) {
                console.log('tok err : ', err);
            } else {
                res.cookie('loginToken', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });

                return res.status(200).json('프로필이 수정되었습니다.');
            }
        }
    );
};

const editpwd = async (req, res) => {
    let { pwd, nickname } = req.body;

    let user = await User.findOne({ nickname }).exec();

    const { salt } = user;

    pwd = await user.encryptPwd(pwd, salt);
    try {
        await User.findOneAndUpdate({ nickname }, { hashedPassword: pwd }, { new: true }).exec();
        return res.status(200).json({ answer: '패스워드가 변경되었습니다.' });
    } catch {}
};

const getuser = async (req, res) => {
    let users = await User.find().exec();

    let arr = [];

    users.map((i) => {
        let { nickname, role } = i;

        arr.push({ nickname, role });
    });

    return res.status(200).json({ arr });
};

const grade = async (req, res) => {
    let privateKey = process.env.PRIVATE_KEY;

    let oldToken = req.cookies.loginToken;

    let tokenBoolean;

    let { userGrade, myName } = req.body;

    jwt.verify(oldToken, privateKey, (err, decode) => {
        tokenBoolean = decode.nickname === myName;
    });

    try {
        let user = await User.findOneAndUpdate({ nickname: myName }, { role: userGrade }, { new: true }).exec();

        if (tokenBoolean) {
            jwt.sign(
                { nickname: user.nickname, role: user.role, photo: user.photo },
                privateKey,
                { algorithm: 'HS512', expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        console.log('tok err : ', err);
                    } else {
                        res.cookie('loginToken', token, {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                        });

                        return res.status(200).json({ answer: '등급을 조정하였습니다.', role: user.role });
                    }
                }
            );
        }
        return res.status(200).json({ answer: '등급을 조정하였습니다.', role: user.role });
    } catch {
        return res.status(200).json({ answer: '등급조정에 실패하였습니다.' });
    }
};

const withdraw = (req, res) => {
    const name = req.body.myName;

    User.findOneAndDelete({ nickname: name }).exec();
    return res.status(200).json({ answer: '유저 정보가 삭제되었습니다.' });
};

module.exports = {
    signup,
    signin,
    tokenAuth,
    logout,
    mypage,
    profileImgUpdate,
    editpwd,
    getuser,
    withdraw,
    grade,
};
