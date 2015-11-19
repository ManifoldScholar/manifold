import React from 'react';
import {Route, IndexRedirect, IndexRoute} from 'react-router';
import {Reader} from './containers/reader';
import {Frontend, Home, Following} from './containers/frontend';
import {NotFound} from './containers/shared';

export default () => {
  return (
    <Route path="/" >
      <IndexRedirect to="browse" />

      <Route component={Reader} path="read/:textId" >
        <Route component={Reader} path="section/:sectionId" />
        <Route component={Reader} path="toc" />
      </Route>

      <Route component={Frontend} path="/browse" >
        <IndexRoute component={Home} />
        <Route component={Following} path="following" />
      </Route>

      <Route component={NotFound} path="*" />
    </Route>
  );
};
