import colorsReducer from '../colors';
import { expect } from 'chai';

describe ('store/reducers/ui/colors', () => {
  it('should return the initial state', ()=> {
    const state = colorsReducer(undefined, {});
    // Must mirror initial state declared in '../typography'
    expect(state).to.deep.equal({
      colorScheme: 'light'
    });
  })
});

describe ('store/reducers/ui/typography/setColorScheme', () => {
  it('should set the value as the payload', ()=> {
    const initialState = {
      colorScheme: 'light'
    };

    const action = {type: 'SET_COLOR_SCHEME', payload: 'dark'};
    const state = colorsReducer(initialState, action);
    expect(state).to.deep.equal({
      colorScheme: 'dark'
    });
  });
});