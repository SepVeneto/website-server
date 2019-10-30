import mongoose from 'mongoose';

export type ArticleDocument = mongoose.Document & {
  title: string,
  columns: Array<string> | string,
  author: string,
  content: string,
  createAt: number,
  updateAt: number,
};

const articleSchema = new mongoose.Schema({
  title: { type: String, require: true },
  columns: { type: Array, require: true},
  author: { type: String, require: true},
  content: { type: String, require: true },
  createAt: {type: Number, default: Date.now()},
  updateAt: { type: Number},
})

articleSchema.pre('save', function save(next) {
  const article = this as ArticleDocument;
  article.updateAt = Date.now();
  next();
})

export const Article = mongoose.model<ArticleDocument>('Article', articleSchema);