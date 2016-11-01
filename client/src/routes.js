import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';
import {
    CollectionDetail,
    CollectionResourceDetail,
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
import { Backend, Dashboard, BackendProjectDetail, TextDetail, Users } from 'containers/backend';
import { Section, AnnotationTools } from 'components/reader';
import { FormsStatic } from './components/frontend';

/* eslint-disable max-len */
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
        <Route component={CollectionResourceDetail} path="project/:id/collection/:collectionId/collection_resource/:collectionResourceId" />
        <Route component={ProjectResources} path="project/:id/resources(/:page)" />
        <Route component={ResourceDetail} path="project/:id/resource/:resourceId" />
        <Route component={EventList} path="project/:id/events(/:page)" />
        <Route component={Page} path="page/:slug" />
      </Route>

      <Route component={Frontend} path="/static" >
        <Route component={FormsStatic} path="forms" />
      </Route>

      <Route component={Frontend} path="*">
        <IndexRoute component={NotFound} />
      </Route>

      <Route component={Backend} path="/backend" >
        <IndexRoute component={Dashboard} />

        <Route component={BackendProjectDetail.Wrapper} path="project/:id" >
          <IndexRoute component={BackendProjectDetail.General} />
          <Route component={BackendProjectDetail.Texts} path="texts" />
          <Route component={BackendProjectDetail.Resources} path="resources" />
          <Route component={BackendProjectDetail.Metadata} path="metadata" />
        </Route>

        <Route component={TextDetail.Wrapper} path="text/:id" >
          <IndexRoute component={TextDetail.General} />
          <Route component={TextDetail.Ingestion} path="ingestion" />
          <Route component={TextDetail.Sections} path="sections" />
          <Route component={TextDetail.Metadata} path="metadata" />
        </Route>

        <Route component={Users.Wrapper} path="users" >
          <IndexRoute component={Users.List} />
        </Route>
      </Route>
    </Route>
  );
};
/* eslint-enable max-len */
