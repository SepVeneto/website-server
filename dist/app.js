"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_graphql_1 = __importDefault(require("express-graphql"));
const commonRoutes_1 = __importDefault(require("./commonRoutes"));
const schema_1 = __importDefault(require("./schema"));
// const log = (msg: string) => {process.stdout.write(msg)}
const sensitiveRoutes = require('./router/index');
const app = express_1.default();
const publicPath = path_1.default.resolve(__dirname, 'static');
mongoose_1.default.connect('mongodb://localhost:27017/website-server', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(express_session_1.default({
    secret: 'salt',
    resave: false,
    name: 'name',
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
}));
app.use(morgan_1.default('dev'));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use('/static', express_1.default.static(publicPath));
app.use('/graphql', express_graphql_1.default({
    schema: schema_1.default,
    graphiql: true,
}));
app.all('*', function (req, res, next) {
    req.get('Origin');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    // res.header('Content-Type', 'application/json;charset=UTF-8');
    // if (req.method === 'OPTIONS') {
    // res.status(200).send('test');
    // res.send(true);
    // }
    // else {
    next();
    // }
});
app.use(commonRoutes_1.default);
app.all('*', (req, res, next) => {
    console.log(req.session);
    if (!req.session.id) {
        res.json({
            code: 403
        });
    }
    else {
        next();
    }
});
app.use(sensitiveRoutes);
app.listen(3000, function () {
    console.log('listen at 3000');
    // log('listen at 3000');
});
//# sourceMappingURL=app.js.map