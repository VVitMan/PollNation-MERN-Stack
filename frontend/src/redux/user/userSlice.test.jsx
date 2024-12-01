import userReducer, {
    signInStart,
    signInSuccess,
    signInFailure,
    clearError,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOut,
  } from './userSlice';
  
  describe('userSlice', () => {
    const initialState = {
      currentUser: null,
      loading: false,
      error: false,
    };
  
    it('should return the initial state', () => {
      expect(userReducer(undefined, {})).toEqual(initialState);
    });
  
    it('should handle signInStart', () => {
      const state = userReducer(initialState, signInStart());
      expect(state).toEqual({ currentUser: null, loading: true, error: false });
    });
  
    it('should handle signInSuccess', () => {
      const user = { id: 1, username: 'testUser' };
      const state = userReducer(initialState, signInSuccess(user));
      expect(state).toEqual({ currentUser: user, loading: false, error: false });
    });
  
    it('should handle signInFailure', () => {
      const error = 'Invalid credentials';
      const state = userReducer(initialState, signInFailure(error));
      expect(state).toEqual({ currentUser: null, loading: false, error });
    });
  
    it('should handle clearError', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const state = userReducer(stateWithError, clearError());
      expect(state.error).toBe(false);
    });
  
    it('should handle updateUserStart', () => {
      const state = userReducer(initialState, updateUserStart());
      expect(state.loading).toBe(true);
    });
  
    it('should handle updateUserSuccess', () => {
      const updatedUser = { id: 1, username: 'updatedUser' };
      const state = userReducer(initialState, updateUserSuccess(updatedUser));
      expect(state).toEqual({
        currentUser: updatedUser,
        loading: false,
        error: false,
      });
    });
  
    it('should handle updateUserFailure', () => {
      const error = 'Update failed';
      const state = userReducer(initialState, updateUserFailure(error));
      expect(state).toEqual({
        currentUser: null,
        loading: false,
        error,
      });
    });
  
    it('should handle deleteUserStart', () => {
      const state = userReducer(initialState, deleteUserStart());
      expect(state.loading).toBe(true);
    });
  
    it('should handle deleteUserSuccess', () => {
      const stateWithUser = { ...initialState, currentUser: { id: 1, username: 'testUser' } };
      const state = userReducer(stateWithUser, deleteUserSuccess());
      expect(state).toEqual({ currentUser: null, loading: false, error: false });
    });
  
    it('should handle deleteUserFailure', () => {
      const error = 'Delete failed';
      const state = userReducer(initialState, deleteUserFailure(error));
      expect(state).toEqual({ currentUser: null, loading: false, error });
    });
  
    it('should handle signOut', () => {
      const stateWithUser = { ...initialState, currentUser: { id: 1, username: 'testUser' } };
      const state = userReducer(stateWithUser, signOut());
      expect(state).toEqual(initialState);
    });
  });
  