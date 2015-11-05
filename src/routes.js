import React from 'react';
import {Route, IndexRedirect, IndexRoute} from 'react-router';
import {Reader} from './containers/Reader';
import {Frontend, Home} from './containers/Frontend';
import {NotFound} from './containers/Shared';

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

      </Route>

      <Route component={NotFound} path="*" />
    </Route>
  );
};
