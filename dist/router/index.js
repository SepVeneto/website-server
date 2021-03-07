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
const columns_1 = require("../models/columns");
const utils_1 = require("../utils");
const User_1 = require("../models/User");
const graphql_1 = require("graphql");
const schema_1 = __importDefault(require("../schema"));
const ArticleList = new graphql_1.GraphQLObjectType({
    name: 'List',
    fields: {
        _id: {
            type: graphql_1.GraphQLID,
        },
        title: {
            type: graphql_1.GraphQLString,
        }
    }
});
function fnName(path) {
    const exp = /\/api\/(.*)/.exec(path);
    const [, name] = exp || [];
    return name;
}
const router = express_1.default.Router();
router.post(/\/api\/*/, function (req, res) {
    const { query, fields } = req.body.query || {};
    const queryString = Object.entries(query || {}).reduce((str, [key, value]) => {
        return str + `${key}: "${value}",`;
    }, '');
    const schema = {
        name: fnName(req.path),
        query: queryString,
        fields: fields.join(','),
    };
    const schemaStr = `{${schema.name}${schema.query ? `(${schema.query})` : ''}{${schema.fields}}}`;
    console.log('schema', schemaStr);
    graphql_1.graphql(schema_1.default, schemaStr).then(({ data }) => {
        return utils_1.response(res, 200, 200, '查询成功', data.getColumns);
    });
});
router.get('/user/logout', (req, res) => {
    req.session.username = null;
    res.json({
        code: 200,
    });
});
router.get('/user/info', function (req, res) {
    const { username } = req.session;
    if (!username) {
        utils_1.response(res, 200, 403, '登录过期', {});
        return;
    }
    User_1.User.findOne({ username }, (err, user) => {
        if (err || !user) {
            utils_1.response(res);
        }
        const result = {
            roles: user.roles,
            config: user.config,
            username: user.username
        };
        utils_1.response(res, 200, 200, '查询成功', result);
    });
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
    const skip = (Number(page) - 1) * Number(pageSize);
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
    yield article_1.Article.find(query, null, { skip, limit, lean: true }, (err, article) => {
        // Article.find((err, article) => {
        if (err) {
            utils_1.response(res);
        }
        const result = {
            total,
            list: article,
        };
        utils_1.response(res, 200, 200, '查询成功', result);
    });
}));
router.get('/article', function (req, res) {
    const { id } = req.query;
    article_1.Article.findOne({ _id: id }, (err, article) => {
        if (err) {
            utils_1.response(res);
        }
        utils_1.response(res, 200, 200, '查询成功', article);
    });
});
router.delete('/article', function (req, res) {
    const { id } = req.query;
    article_1.Article.deleteOne({ _id: id }, err => {
        if (err) {
            utils_1.response(res);
        }
        utils_1.response(res, 200, 200, '删除成功', '');
    });
});
router.post('/upload/article', function (req, res) {
    const id = req.body._id;
    if (id) {
        article_1.Article.update({ _id: id }, Object.assign(Object.assign({}, req.body), { updateAt: Date.now() }), err => {
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
    fs_1.default.writeFile(`static/image/test.png`, req.body.base64, 'base64', (error) => {
        error ? console.log('fail', error) : console.log('success');
    });
    res.end(JSON.stringify({ code: 200, location: 'static/image/test.png' }));
});
router.get('/article/getColumns', function (req, res) {
    columns_1.Columns.find((err, column) => {
        if (err) {
            utils_1.response(res);
        }
        utils_1.response(res, 200, 200, '查询成功', column);
    });
});
router.post('/columns/list', function (req, res) {
    console.log('request: ', req.body);
    graphql_1.graphql(schema_1.default, req.body.query).then(({ data }) => {
        console.log('router/index.ts:148', data);
        return utils_1.response(res, 200, 200, '查询成功', data.getColumns);
    });
    // console.log('req:', req)
    // graphqlHTTP({ schema })(req, res).then(data => console.log('data:', data));
    // response(res, 200, 200, '查询成功', column);
    // Columns.find((err, column) => {
    //   if (err) {
    //     response(res);
    //   }
    //   response(res, 200, 200, '查询成功', column);
    // })
});
router.get('/columns/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ;
    const _b = req.query, { page, pageSize } = _b, conditions = __rest(_b, ["page", "pageSize"]);
    // const {title, author, columns} = JSON.parse(conditions);
    const query = {};
    for (let key in conditions) {
        if (conditions[key]) {
            query[key] = new RegExp(`${conditions[key]}`);
        }
    }
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = skip + parseInt(pageSize);
    let total = 0;
    yield columns_1.Columns.countDocuments(query, (err, count) => {
        if (err) {
            utils_1.response(res);
            return false;
        }
        total = count;
        return true;
    });
    yield columns_1.Columns.find(query, null, { skip, limit, lean: true }, (err, article) => {
        // Article.find((err, article) => {
        if (err) {
            utils_1.response(res);
        }
        const result = {
            total,
            list: article,
        };
        utils_1.response(res, 200, 200, '查询成功', result);
    });
}));
router.post('/columns', function (req, res) {
    const { _id } = req.body;
    if (_id) {
        columns_1.Columns.update({ _id }, Object.assign(Object.assign({}, req.body), { updateAt: Date.now() }), err => {
            if (err) {
                utils_1.response(res);
            }
            utils_1.response(res, 200, 200, '修改成功');
        });
    }
    else {
        const newColumn = new columns_1.Columns(Object.assign({}, req.body));
        newColumn.save();
        utils_1.response(res, 200, 200, '创建成功');
    }
});
router.get('/users', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        ;
        const _a = req.query, { page, pageSize } = _a, conditions = __rest(_a, ["page", "pageSize"]);
        const query = {};
        for (let key in conditions) {
            conditions[key] && (query[key] = new RegExp(`${conditions[key]}`));
        }
        const skip = (Number(page) - 1) * Number(pageSize);
        const limit = skip + parseInt(pageSize);
        let total = 0;
        yield User_1.User.countDocuments(query, (err, count) => {
            if (err) {
                utils_1.response(res);
                return false;
            }
            total = count;
            return true;
        });
        yield User_1.User.find(query, null, { skip, limit, lean: true }, (err, user) => {
            if (err) {
                utils_1.response(res);
            }
            utils_1.response(res, 200, 200, '查询成功', user);
        });
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map