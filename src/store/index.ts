import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import postReducer from 'store/slices/postSlice';
import plantSlice from './slices/plantsSlice';
import additiveSlice from './slices/additiveSlice';
import userSlice from './slices/userSlice';
import MaterialSlice from './slices/MaterialSlice';
import AuthSlice from './slices/authSlice';
import furnaceMaterialSlice from './slices/furnaceMaterialSlice';
import plantConfigSlice from './slices/plantGetData'

const store = configureStore({
  reducer: {
    post: postReducer,
    plant: plantSlice,
    additive: additiveSlice,
    user: userSlice,
    material: MaterialSlice,
    login: AuthSlice,
    furnace: furnaceMaterialSlice,
    plant_config : plantConfigSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
