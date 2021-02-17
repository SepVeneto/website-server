"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const articleSchema = new mongoose_1.default.Schema({
    title: { type: String, require: true },
    columns: { type: Array, require: true },
    author: { type: String, require: true },
    content: { type: String, require: true },
    createAt: { type: Number, default: Date.now() },
    updateAt: { type: Number },
});
articleSchema.pre('save', function save(next) {
    const article = this;
    article.updateAt = Date.now();
    next();
});
exports.Article = mongoose_1.default.model('Article', articleSchema);
//# sourceMappingURL=article.js.map