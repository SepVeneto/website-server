"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function response(res, httpCode = 500, code = 381, message = "服务端异常", data = {}) {
    const responseData = {
        code,
        message,
        data,
    };
    res.status(httpCode).json(responseData);
}
exports.response = response;
//# sourceMappingURL=utils.js.map