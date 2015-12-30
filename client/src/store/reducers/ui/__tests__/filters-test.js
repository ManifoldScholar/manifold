import filterReducer from '../filters';
import { expect } from 'chai';

describe('store/reducers/ui/filters', () => {

  it('should return the initial state', () => {
    const state = filterReducer(undefined, {});
    expect(state).to.deep.equal({project: {}});
  })

  it('should set the project filter correctly', () => {
    const action = {type: 'SET_PROJECT_FILTERS', payload: {published: true}}
    const state = filterReducer({}, action);
    expect(state).to.deep.equal({project: {published: true}});
  })

});
