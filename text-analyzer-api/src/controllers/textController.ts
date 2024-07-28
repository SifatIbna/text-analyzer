import { Request, Response } from 'express';
import { TextService } from '@services/textService';
import {AuthenticatedRequest} from '@middleware/authMiddleware';

export const createText = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { content } = req.body;
    const userId = req.user.sub;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in token' });
    }

    const text = await TextService.createText(content, userId);
    res.status(201).json(text);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
};

export const getText = async (req: Request, res: Response) => {
  try {
    const text = await TextService.getText(req.params.id);
    res.json(text);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(404).json({ error: errorMessage });
  }
};

export const updateText = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = (req as any).user.sub;
    const text = await TextService.updateText(req.params.id, content, userId);
    res.json(text);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
};

export const deleteText = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.sub;
    await TextService.deleteText(req.params.id, userId);
    res.status(204).end();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(404).json({ error: errorMessage });
  }
};

export const getTextAnalysis = async (req: Request, res: Response) => {
  try {
    const analysis = await TextService.getTextAnalysis(req.params.id);
    res.json(analysis);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(404).json({ error: errorMessage });
  }
};