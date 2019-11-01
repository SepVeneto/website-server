import mongoose from 'mongoose';

export type ColumnsDocument = mongoose.Document & {
  name: string,
  value: string,
  background: string,
  font: string,
}

const columnsSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  value: { type: String, require: true, unique: true },
  background: {type: String},
  font: {type: String}
})

export const Columns = mongoose.model<ColumnsDocument>('Columns', columnsSchema);