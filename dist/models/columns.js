"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Columns = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const columnsSchema = new mongoose_1.default.Schema({
    name: { type: String, require: true, unique: true },
    value: { type: String, require: true, unique: true },
    color: { type: String },
});
exports.Columns = mongoose_1.default.model('Columns', columnsSchema);
//# sourceMappingURL=columns.js.map