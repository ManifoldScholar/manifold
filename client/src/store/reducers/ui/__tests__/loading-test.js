import loadingReducer from '../loading';
import { expect } from 'chai';

describe('store/reducers/ui/loading', () => {
  it('should return the initial state', () => {
    const state = loadingReducer(undefined, {});
    expect(state).to.deep.equal({
      state: 'default'
    });
  });

  it('set the correct state in response to a LOAD_STATE_DEFAULT action', () => {
    const initialState = { state: 'loading' };
    const action = { type: 'LOAD_STATE_DEFAULT' };
    const state = loadingReducer(initialState, action);
    expect(state).to.deep.equal({ state: 'default'});
  });

  it('set the correct state in response to a LOAD_STATE_LOADING action', () => {
    const initialState = { state: 'default' };
    const action = { type: 'LOAD_STATE_LOADING' };
    const state = loadingReducer(initialState, action);
    expect(state).to.deep.equal({ state: 'loading'});
  });


  it('set the correct state in response to a LOAD_STATE_COMPLETE action', () => {
    const initialState = { state: 'default' };
    const action = { type: 'LOAD_STATE_COMPLETE' };
    const state = loadingReducer(initialState, action);
    expect(state).to.deep.equal({ state: 'complete'});
  });


});
