import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import get from 'lodash/get';

const select = (state) => {
  const newState = Object.assign({}, state);
  const collections = Object.assign({}, state.entityStore);
  const entities = Object.assign({}, state.entityStore.entities);
  newState.entityStore = collections;
  newState.entityStore.entities = entities;
  if (get(entities, 'textSections')) {
    entities.textSections = {
      redacted: true
    };
  }
  return newState;
};

export default createDevTools(
  <DockMonitor
    defaultIsVisible={false}
    toggleVisibilityKey="H"
    changePositionKey="Q"
  >
    <LogMonitor select={select}/>
  </DockMonitor>
);
