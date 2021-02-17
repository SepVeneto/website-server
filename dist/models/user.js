"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    roles: { type: String, default: 'editor' },
    createAt: { type: Date, default: Date.now },
    config: { type: Object, default: {} },
});
userSchema.methods.name = function () {
    return this.username;
};
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map