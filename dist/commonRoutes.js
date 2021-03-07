"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = require("./models/User");
const utils_1 = require("./utils");
const router = express_1.default.Router();
function encryption(password) {
    const salt = 'veneto';
    const md5 = crypto_1.default.createHmac('sha256', salt);
    // const unencryptedString = salt + md5;
    md5.update(password);
    return md5.digest('hex');
}
router.post('/user/login', (req, res) => {
    const { username, password } = req.body;
    req.session.username = username;
    // console.log(req.cookies);
    const encryptePaw = encryption(password);
    try {
        User_1.User.findOne({ username, password: encryptePaw }, (err, user) => {
            if (err) {
                utils_1.response(res);
            }
            console.log(user);
            if (!user) {
                console.log('enter');
                utils_1.response(res, 200, 403, '用户名或密码错误', {});
            }
            else {
                // const result = {
                // 	roles: user.roles
                // };
                utils_1.response(res, 200, 200, '登录成功', { token: req.sessionID });
            }
        });
    }
    catch (err) {
        utils_1.response(res);
        console.error(err);
    }
});
router.post('/user/signup', (req, res, next) => {
    const { username, password } = req.body;
    User_1.User.findOne({ username }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            utils_1.response(res, 200, 200, '用户已存在');
        }
        const newUser = new User_1.User({
            username,
            password: encryption(password),
        });
        newUser.save(next);
        utils_1.response(res, 200, 200, '注册成功');
    });
});
exports.default = router;
//# sourceMappingURL=commonRoutes.js.map