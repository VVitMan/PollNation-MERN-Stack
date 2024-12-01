import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

vi.mock('redux-persist/lib/storage', () => ({
  setItem: vi.fn(() => Promise.resolve()),
  getItem: vi.fn(() => Promise.resolve(null)),
  removeItem: vi.fn(() => Promise.resolve()),
}));

describe('Redux Store Configuration', () => {
  let testStore;

  beforeEach(() => {
    const rootReducer = { user: userReducer };
    const persistConfig = {
      key: 'root',
      storage,
      version: 1,
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    // Create a fresh store instance for testing
    testStore = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
  });

  it('should initialize with the correct default state', () => {
    const state = testStore.getState();
    expect(state.user).toEqual({
      currentUser: null,
      loading: false,
      error: false,
    });
  });

  it('should handle user-related actions', () => {
    // Dispatch a sign-in action
    const user = { username: 'testUser' };
    testStore.dispatch({ type: 'user/signInSuccess', payload: user });

    const state = testStore.getState();
    expect(state.user.currentUser).toEqual(user);
    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(false);
  });

  it('should persist state to storage', async () => {
    const user = { username: 'persistedUser' };

    // Dispatch an action to update the state
    testStore.dispatch({ type: 'user/signInSuccess', payload: user });

    // Simulate flushing state to local storage
    expect(storage.setItem).toHaveBeenCalled();
    const state = testStore.getState();
    expect(state.user.currentUser).toEqual(user);
  });

  it('should rehydrate state from storage', async () => {
    const preloadedState = {
      user: {
        currentUser: { username: 'rehydratedUser' },
        loading: false,
        error: false,
      },
    };

    vi.mocked(storage.getItem).mockResolvedValueOnce(JSON.stringify(preloadedState));

    const rootReducer = { user: userReducer };
    const persistConfig = {
      key: 'root',
      storage,
      version: 1,
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    // Create a new store instance to simulate rehydration
    const rehydratedStore = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });

    const state = rehydratedStore.getState();
    expect(state.user.currentUser.username).toBe('rehydratedUser');
  });
});
