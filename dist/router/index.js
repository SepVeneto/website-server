"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const article_1 = require("../models/article");
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get('/user/logout', (req, res) => {
    req.session.username = null;
    res.json({
        code: 200,
    });
});
router.get('/user/info', function (req, res) {
    console.log(req.session.username);
    res.end(JSON.stringify({
        code: 200,
        data: {
            name: 'qez',
            roles: ['admin']
        },
        update: 'success'
    }));
});
router.get('/article/getArticles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ;
    const _a = req.query, { page, pageSize } = _a, conditions = __rest(_a, ["page", "pageSize"]);
    // const {title, author, columns} = JSON.parse(conditions);
    const query = {};
    for (let key in conditions) {
        if (conditions[key]) {
            query[key] = new RegExp(`${conditions[key]}`);
        }
    }
    const skip = (page - 1) * pageSize;
    const limit = skip + parseInt(pageSize);
    let total = 0;
    yield article_1.Article.countDocuments(query, (err, count) => {
        if (err) {
            utils_1.response(res);
            return false;
        }
        total = count;
        return true;
    });
    yield article_1.Article.find(query, null, { skip, limit }, (err, article) => {
        // Article.find((err, article) => {
        if (err) {
            utils_1.response(res);
        }
        const result = {
            total,
            list: article,
        };
        console.log(result.total);
        utils_1.response(res, 200, 200, '查询成功', result);
    });
}));
router.get('/article', function (req, res) {
    const { id } = req.query;
    article_1.Article.findOne({ _id: id }, (err, article) => {
        if (err) {
            utils_1.response(res);
        }
        utils_1.response(res, 200, 200, '查询成功', { data: article });
    });
});
router.post('/upload/article', function (req, res) {
    const id = req.body.id;
    if (id) {
        article_1.Article.update({ _id: id }, Object.assign({}, req.body), err => {
            if (err) {
                utils_1.response(res);
            }
            utils_1.response(res, 200, 200, '修改成功');
        });
    }
    else {
        const newArticle = new article_1.Article(Object.assign(Object.assign({}, req.body), { author: req.session.username }));
        newArticle.save();
        utils_1.response(res, 200, 200, '创建成功');
    }
});
router.post('/upload/image', function (req, res) {
    console.log(req.session);
    fs_1.default.writeFile(`./static/image/test.png`, req.body.base64, 'base64', (error) => {
        error ? console.log('fail', error) : console.log('success');
    });
    res.end(JSON.stringify({ code: 200, location: '/static/image/test.png' }));
});
module.exports = router;
//# sourceMappingURL=index.js.map