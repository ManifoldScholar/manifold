import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import get from 'lodash/get';

const select = (state) => {
  const newState = Object.assign({}, state);
  const collections = Object.assign({}, state.collections);
  const entities = Object.assign({}, state.collections.entities);
  newState.collections = collections;
  newState.collections.entities = entities;
  if (get(entities, 'textSections')) {
    entities.textSections = 'REDACTED';
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
