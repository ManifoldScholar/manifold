import visibilityReducer from '../visibility';
import { expect } from 'chai';

describe('store/reducers/ui/visibility', () => {
  it('should return the initial state', () => {
    const state = visibilityReducer(undefined, {});
    // Must mirror initial state declared in '../visibility'
    expect(state).to.deep.equal({
      loginOverlay: false,
      userMenu: false,
      tocDrawer: false,
      uiPanels: {
        user: false,
        appearance: false,
        layers: false,
        search: false
      }
    });
  });
});

describe('store/reducers/ui/visibility/panelToggle', () => {
  it('should set a single panel to true if it is false', () => {
    const initialState = {
      uiPanels: {
        user: false,
        appearance: false
      }
    };

    const action = {type: 'PANEL_TOGGLE', payload: 'appearance'};
    const state = visibilityReducer(initialState, action);
    expect(state).to.deep.equal({
      uiPanels: {
        user: false,
        appearance: true
      }
    });
  });

  it('should set a single panel in panelSolo object to true, and set all other panels to false', () => {
    const initialState = {
      uiPanels: {
        user: true,
        appearance: false,
        layers: true
      }
    };
    const action = {type: 'PANEL_TOGGLE', payload: 'appearance'};
    const state = visibilityReducer(initialState, action);
    expect(state).to.deep.equal({
      uiPanels: {
        user: false,
        appearance: true,
        layers: false
      }
    });
  });

  it('should set a single panel to false if it is true', () => {
    const initialState = {
      uiPanels: {
        user: false,
        appearance: true
      }
    };
    const action = {type: 'PANEL_TOGGLE', payload: 'appearance'};
    const state = visibilityReducer(initialState, action);
    expect(state).to.deep.equal({
      uiPanels: {
        user: false,
        appearance: false
      }
    });
  });

  it('should set a single panel to false without affecting other panels', ()=> {
    const initialState = {
      uiPanels: {
        user: true,
        appearance: true
      }
    };
    const action = {type: 'PANEL_TOGGLE', payload: 'appearance'};
    const state = visibilityReducer(initialState, action);
    expect(state).to.deep.equal({
      uiPanels: {
        user: true,
        appearance: false
      }
    });
  });
});

describe('store/reducers/ui/visibility/panelShow', () => {
  it('should set a single panel to true', () => {
    const initialState = {
      uiPanels: {
        user: false,
        appearance: false
      }
    };

    const action = {type: 'PANEL_SHOW', payload: 'appearance'};
    const state = visibilityReducer(initialState, action);
    expect(state).to.deep.equal({
      uiPanels: {
        user: false,
        appearance: true
      }
    });
  });

  it('should set a single panel in panelSolo object to true, and set all other panels to false', () => {
    const initialState = {
      uiPanels: {
        user: true,
        appearance: false,
        layers: true
      }
    };
    const action = {type: 'PANEL_SHOW', payload: 'appearance'};
    const state = visibilityReducer(initialState, action);
    expect(state).to.deep.equal({
      uiPanels: {
        user: false,
        appearance: true,
        layers: false
      }
    });
  });
});

describe('store/reducers/ui/visibility/panelHide', () => {
  it('should set a single panel to false', () => {
    const initialState = {
      uiPanels: {
        user: false,
        appearance: true
      }
    };
    const action = {type: 'PANEL_HIDE', payload: 'appearance'};
    const state = visibilityReducer(initialState, action);
    expect(state).to.deep.equal({
      uiPanels: {
        user: false,
        appearance: false
      }
    });
  });
});

