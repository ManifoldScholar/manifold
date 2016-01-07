import typographyReducer from '../typography';
import { expect } from 'chai';

describe('store/reducers/ui/typography', () => {
  it('should return the initial state', ()=> {
    const state = typographyReducer(undefined, {});
    // Must mirror initial state declared in '../typography'
    expect(state).to.deep.equal({
      font: 'serif',
      size: 3,
      sizeMax: 5,
      sizeMin: 0
    });
  });
});

describe('store/reducers/ui/typography/selectFont', () => {
  it('should set the value as the payload', ()=> {
    const initialState = {
      font: 'serif'
    };

    const action = {type: 'SELECT_FONT', payload: 'sans-serif'};
    const state = typographyReducer(initialState, action);
    expect(state).to.deep.equal({
      font: 'sans-serif'
    });
  });
});

describe('store/reducers/ui/typography/incrementFontSize', () => {
  it('Should increment the value by 1', () => {
    const initialState = {
      size: 1,
      sizeMax: 5
    };

    const action = {type: 'INCREMENT_FONT_SIZE'};
    const state = typographyReducer(initialState, action);
    expect(state).to.deep.equal({
      size: 2,
      sizeMax: 5
    });
  });

  it('Should return the same value if it is at maximum', () => {
    const initialState = {
      size: 5,
      sizeMax: 5
    };

    const action = {type: 'INCREMENT_FONT_SIZE'};
    const state = typographyReducer(initialState, action);
    expect(state).to.deep.equal(initialState);
  });
});

describe('store/reducers/ui/typography/decrementFontSize', () => {
  it('Should decrement the value by 1', () => {
    const initialState = {
      size: 1,
      sizeMin: -5
    };

    const action = {type: 'DECREMENT_FONT_SIZE'};
    const state = typographyReducer(initialState, action);
    expect(state).to.deep.equal({
      size: 0,
      sizeMin: -5
    });
  });

  it('Should return the same value if it is at minimum', () => {
    const initialState = {
      size: -5,
      sizeMin: -5
    };

    const action = {type: 'DECREMENT_FONT_SIZE'};
    const state = typographyReducer(initialState, action);
    expect(state).to.deep.equal(initialState);
  });
});
