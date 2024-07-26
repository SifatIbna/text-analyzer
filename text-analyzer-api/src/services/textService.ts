import { Text, IText } from '@models/Text';
import { CacheService } from '@services/cacheService';
import mongoose from 'mongoose';

export class TextService {
  static async createText(content: string, userId: string): Promise<IText> {
    const text = new Text({ content, user: userId });
    await text.save();
    await this.analyzeAndStoreText(text._id.toString());
    return text;
  }

  static async getText(id: string): Promise<IText> {
    const cachedText = await CacheService.get(`text:${id}`);
    if (cachedText) {
      try {
        return JSON.parse(cachedText) as IText;
      } catch (error) {
        console.error('Error parsing cached text:', error);
        // If parsing fails, we'll fetch from the database
      }
    }

    const text = await Text.findById(id);
    if (!text) throw new Error('Text not found');

    await CacheService.set(`text:${id}`, JSON.stringify(text.toObject()));
    return text;
  }

  static async updateText(id: string, content: string, userId: string): Promise<IText> {
    const text = await Text.findOneAndUpdate(
      { _id: id, user: userId },
      { content },
      { new: true }
    );
    if (!text) throw new Error('Text not found or unauthorized');

    await CacheService.del(`text:${id}`);
    await this.analyzeAndStoreText(text._id.toString());
    return text;
  }

  static async deleteText(id: string, userId: string): Promise<void> {
    const result = await Text.deleteOne({ _id: id, user: userId });
    if (result.deletedCount === 0) throw new Error('Text not found or unauthorized');

    await CacheService.del(`text:${id}`);
  }

  static async getTextAnalysis(id: string): Promise<any> {
    const text = await this.getText(id);
    return text.analysis;
  }

  private static async analyzeAndStoreText(id: string): Promise<void> {
    const text = await Text.findById(id);
    if (!text) throw new Error('Text not found');

    const analysis = this.analyzeText(text.content);
    
    text.analysis = analysis;
    await text.save();
  }

  private static analyzeText(content: string) {
    return {
      words: this.countWords(content),
      characters: this.countCharacters(content),
      sentences: this.countSentences(content),
      paragraphs: this.countParagraphs(content),
      longestWords: this.getLongestWords(content),
    };
  }

  private static countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private static countCharacters(text: string): number {
    return text.replace(/\s/g, '').length;
  }

  private static countSentences(text: string): number {
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  }

  private static countParagraphs(text: string): number {
    return text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
  }

  private static getLongestWords(text: string): string[] {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const maxLength = Math.max(...words.map(word => word.length));
    return words.filter(word => word.length === maxLength);
  }
}