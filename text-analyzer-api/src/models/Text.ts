import mongoose from 'mongoose';

export interface IText extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  user: string;
  analysis: {
    words: number;
    characters: number;
    sentences: number;
    paragraphs: number;
    longestWords: string[];
  };
}

const textSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: String, required: true },
  analysis: {
    words: Number,
    characters: Number,
    sentences: Number,
    paragraphs: Number,
    longestWords: [String]
  }
});

export const Text = mongoose.model<IText>('Text', textSchema);