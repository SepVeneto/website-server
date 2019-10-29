"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./models/user");
const router = express_1.default.Router();
router.post('/user/login', (req, res) => {
    const { username, password } = req.body;
    req.session.username = username;
    res.json({
        code: 200,
        roles: ['admin'],
    });
});
router.post('/user/signup', (req, res, next) => {
    const { username, password } = req.body;
    user_1.User.findOne({ username }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            return res.json({
                code: 200,
                message: '用户已存在',
            });
        }
        const newUser = new user_1.User({
            username, password
        });
        newUser.save(next);
    });
});
exports.default = router;
//# sourceMappingURL=commonRoutes.js.map