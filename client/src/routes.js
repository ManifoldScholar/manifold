import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';
import {
    CollectionDetail,
    Following,
    Frontend,
    Home,
    EventList,
    Login,
    NotFound,
    Page,
    ProjectDetail,
    ProjectResources,
    ResourceDetail
} from 'containers/frontend';
import { Developer } from 'containers/developer';
import { Reader } from 'containers/reader';
import { Section, AnnotationTools } from 'components/reader';
import { FormsStatic } from './components/frontend';

export default () => {
  return (
      <Route path="/" >
        <IndexRedirect to="browse" />
        <Route component={Developer} path="dev" />

        <Route component={Reader} path="read/:textId">
          <Route component={Section} path="section/:sectionId" />
          <Route component={AnnotationTools} path="annotation-tools" />
        </Route>

        <Route component={Frontend} path="/browse" >
          <IndexRoute component={Home} />
          <Route component={Login} path="login" />
          <Route component={Following} path="following" />
          <Route component={ProjectDetail} path="project/:id" />
          <Route component={CollectionDetail} path="project/:id/collection/:collectionId" />
          <Route component={ProjectResources} path="project/:id/resources(/:page)" />
          <Route component={ResourceDetail} path="resource/:id" />
          <Route component={EventList} path="project/:id/events(/:page)" />
          <Route component={Page} path="page/:slug" />
        </Route>

        <Route component={Frontend} path="/static" >
          <Route component={FormsStatic} path="forms" />
        </Route>

        <Route component={Frontend} path="*">
          <IndexRoute component={NotFound} />
        </Route>
      </Route>
  );
};
