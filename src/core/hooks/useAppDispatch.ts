/**
 * 🔄 useAppDispatch Hook
 * Typed dispatch hook for Redux actions
 */

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

/**
 * Use this hook instead of plain useDispatch for proper typing
 * when dispatching async actions (thunks)
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
