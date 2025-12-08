
import { TetrisBlock, TetrisGoal } from '../types';

const STORAGE_KEY_BLOCKS = 'fbanks_tetris_blocks';
const STORAGE_KEY_GOALS = 'fbanks_tetris_goals';

export const saveBlocks = (blocks: TetrisBlock[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(blocks));
  } catch (e) {
    console.error('Failed to save blocks', e);
  }
};

export const getBlocks = (): TetrisBlock[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_BLOCKS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load blocks', e);
    return [];
  }
};

export const saveGoals = (goals: TetrisGoal[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals', e);
  }
};

export const getGoals = (): TetrisGoal[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_GOALS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load goals', e);
    return [];
  }
};
