"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const articleSchema = new mongoose_1.default.Schema({
    title: { type: String, require: true },
    columns: { type: Array, require: true },
    author: { type: String, require: true },
    content: { type: String, require: true },
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date },
});
articleSchema.pre('save', function save(next) {
    console.log('update time');
    const article = this;
    article.updateAt = new Date();
    next();
});
exports.Article = mongoose_1.default.model('Article', articleSchema);
//# sourceMappingURL=article.js.map