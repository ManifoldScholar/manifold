import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';

import * as Backend from 'containers/backend';
import * as Frontend from 'containers/frontend';
import * as Reader from 'containers/reader';
import * as FrontendComponents from 'components/frontend';
import * as BackendComponents from 'components/backend';
import * as ReaderComponents from 'components/reader';

/* eslint-disable max-len */
export default () => {

  return (
    <Route path="/" >
      <IndexRedirect to="browse" />

      <Route component={Reader.Reader} path="read/:textId">
        <Route component={ReaderComponents.Section.Text} path="section/:sectionId">
          <Route component={Reader.Resource.Detail} path="resource/:resourceId"/>
        </Route>
      </Route>

      <Route component={Frontend.Frontend} path="/browse" >
        <IndexRoute component={Frontend.Home} />
        <Route component={Frontend.Login} path="login" />
        <Route component={Frontend.PasswordReset} path="reset-password/:resetToken" />
        <Route component={Frontend.Following} path="following" />
        <Route component={Frontend.Featured} path="featured" />
        <Route component={Frontend.ProjectDetail} path="project/:id" />
        <Route component={Frontend.CollectionDetail} path="project/:id/collection/:collectionId" />
        <Route component={Frontend.CollectionResourceDetail} path="project/:id/collection/:collectionId/collection_resource/:collectionResourceId" />
        <Route component={Frontend.ProjectResources} path="project/:id/resources(/:page)" />
        <Route component={Frontend.ResourceDetail} path="project/:id/resource/:resourceId" />
        <Route component={Frontend.EventList} path="project/:id/events(/:page)" />
        <Route component={Frontend.Page} path="page/:slug" />
      </Route>

      <Route component={Frontend.Frontend} path="/static" >
        <Route component={FrontendComponents.Static.Form} path="forms" />
      </Route>

      <Route component={Backend.Backend} path="/backend" >
        <IndexRoute component={Backend.Dashboard} />
        <Route component={Backend.NewResource.Wrapper} path="project/:projectId/resources/new" />
        <Route component={Backend.NewProject.Wrapper} path="project/new" />
        <Route component={Backend.ProjectDetail.Wrapper} path="project/:id" >
          <IndexRoute component={Backend.ProjectDetail.General} />
          <Route component={Backend.ProjectDetail.Texts} path="texts" >
            <Route component={Backend.ProjectDetail.Category.New} path="category/new" />
            <Route component={Backend.ProjectDetail.Category.Edit} path="category/:catId/edit" />
          </Route>
          <Route component={Backend.ProjectDetail.Resources} path="resources" />
          <Route component={Backend.ProjectDetail.Collaborators} path="collaborators" />
          <Route component={Backend.ProjectDetail.Metadata} path="metadata" />
        </Route>
        <Route component={Backend.People.Wrapper} path="people" >
          <IndexRoute component={Backend.People.Users.List} />
          <Route component={Backend.People.Users.List} path="users" >
            <Route component={Backend.People.Users.Edit} path=":id" />
          </Route>
          <Route component={Backend.People.Makers.List} path="makers" >
            <Route component={Backend.People.Makers.Edit} path=":id" />
          </Route>
        </Route>
        <Route component={Backend.TextDetail.Wrapper} path="text/:id" >
          <IndexRoute component={Backend.TextDetail.General} />
          <Route component={Backend.TextDetail.Collaborators} path="collaborators" />
          <Route component={Backend.TextDetail.Metadata} path="metadata" />
        </Route>
        <Route component={Backend.ResourceDetail.Wrapper} path="resource/:id" >
          <IndexRoute component={Backend.ResourceDetail.General} />
        </Route>
        <Route component={Backend.Settings.Wrapper} path="settings" >
          <IndexRoute component={Backend.Settings.General} />
          <Route component={Backend.Settings.Theme} path="theme" />
          <Route component={Backend.Settings.OAuth} path="oauth" />
          <Route component={Backend.Settings.Features} path="features" />
          <Route component={Backend.Settings.PressLogo} path="press_logo" />
        </Route>
        <Route component={Frontend.NotFound} path="*" />
      </Route>
      <Route component={Frontend.Frontend} path="*">
        <IndexRoute component={Frontend.NotFound} />
      </Route>
    </Route>
  );
};
/* eslint-enable max-len */
