import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Section from "reader/components/section";
import {
  sectionsAPI,
  annotationsAPI,
  resourcesAPI,
  resourceCollectionsAPI,
  requests
} from "api";
import { grab, isEntityLoaded } from "utils/entityUtils";
import { entityStoreActions } from "actions";
import uniq from "lodash/uniq";
import difference from "lodash/difference";
import get from "lodash/get";
import isNil from "lodash/isNil";
import remove from "lodash/remove";
import some from "lodash/some";
import isEqual from "lodash/isEqual";
import { childRoutes } from "helpers/router";
import HeadContent from "global/components/HeadContent";
import values from "lodash/values";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import withSettings from "hoc/withSettings";

const { request, flush } = entityStoreActions;

export class SectionContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const state = getState();
    const promises = [];
    const { sectionId } = match.params;
    const sectionLoaded = sectionId
      ? isEntityLoaded("textSections", sectionId, state)
      : false;

    if (sectionId && !sectionLoaded) {
      const sectionCall = sectionsAPI.show(sectionId);
      const { promise: two } = dispatch(
        request(sectionCall, requests.rSection)
      );
      promises.push(two);
    }
    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      section: grab(
        "textSections",
        ownProps.match.params.sectionId,
        state.entityStore
      )
    };
  };

  static propTypes = {
    section: PropTypes.object,
    route: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    annotations: PropTypes.array,
    resources: PropTypes.array,
    resourceCollections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    text: PropTypes.object.isRequired,
    appearance: PropTypes.object.isRequired,
    authentication: PropTypes.object
  };

  componentDidMount() {
    if (this.props.match.params.sectionId) {
      this.fetchAnnotations(this.props);
      this.fetchResources(this.props);
      this.fetchCollections(this.props);
    }
  }

  componentDidUpdate(prevProps) {
    // Fetch resources and annotations on section change.
    if (
      prevProps.match.params.sectionId !== this.props.match.params.sectionId
    ) {
      this.fetchAnnotations(this.props);
      this.fetchResources(this.props);
      this.fetchCollections(this.props);
    }

    // If the user just logged in, we need to refetch annotations in case they had private
    // ones. We check authToken here rather than just authentication.currentUser because
    // the API relies on the authToken, which is set after currentUser,
    // to be present in the request header to identify the reader.
    if (
      !prevProps.authentication.authToken &&
      this.props.authentication.authToken
    ) {
      this.fetchAnnotations(this.props);
    }

    // Check if we need to fetch more resources when annotations change
    // Needs to be deep comparison
    if (!isEqual(prevProps.annotations, this.props.annotations)) {
      const missing = this.hasMissingResourcesOrCollections(
        this.props.annotations,
        this.props.resources,
        this.props.resourceCollections
      );
      if (missing) {
        if (some(missing, ["type", "resource"])) {
          this.fetchResources(this.props);
        }
        if (some(missing, ["type", "resource_collection"])) {
          this.fetchCollections(this.props);
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rSection));
    this.props.dispatch(flush(requests.rSectionResources));
    this.props.dispatch(flush(requests.rSectionResourceCollections));
  }

  fetchAnnotations(props) {
    const sectionId = props.match.params.sectionId;

    const annotationsCall = annotationsAPI.forSection(sectionId);

    props.dispatch(request(annotationsCall, requests.rAnnotations));
  }

  fetchResources(props) {
    const resourcesCall = resourcesAPI.forSection(props.match.params.sectionId);
    props.dispatch(request(resourcesCall, requests.rSectionResources));
  }

  fetchCollections(props) {
    const collectionsCall = resourceCollectionsAPI.forSection(
      props.match.params.sectionId
    );
    props.dispatch(
      request(collectionsCall, requests.rSectionResourceCollections)
    );
  }

  hasMissingResourcesOrCollections(annotations, resourcesIn, collectionsIn) {
    if (!annotations) return;
    const resources = resourcesIn || [];
    const collections = collectionsIn || [];
    const needed = uniq(
      annotations
        .map(a => {
          return {
            id: a.attributes.resourceId || a.attributes.resourceCollectionId,
            type: a.attributes.format
          };
        })
        .filter(id => id !== null)
    );
    const has = resources.map(r => r.id);
    const cHas = collections.map(r => r.id);
    has.concat(cHas);
    const diff = difference(needed, has);
    if (diff.length > 0) return diff;
    return false;
  }

  showLabel() {
    const text = this.props.text;
    if (text.attributes.published) return false;
    if (get(text, "relationships.category.attributes.title")) return true;
    return false;
  }

  renderStyles = props => {
    return values(props.section.relationships.stylesheets).map(stylesheet => {
      return (
        <style
          key={stylesheet.id}
          dangerouslySetInnerHTML={{ __html: stylesheet.attributes.styles }}
        />
      );
    });
  };

  renderRoutes() {
    const { text, section } = this.props;
    const childProps = { text, section };
    return childRoutes(this.props.route, { childProps });
  }

  render() {
    if (!this.props.section || !this.props.text) return null;
    const { text, section, settings } = this.props;
    const { project } = text.relationships;
    const textTitle = text.attributes.titlePlaintext;
    const sectionTitle = section.attributes.name;
    const projectTitle = project.attributes.titlePlainText;

    const parts = remove(
      uniq([sectionTitle, textTitle, projectTitle]),
      v => !isNil(v)
    );
    const append = settings.attributes.general.installationName;
    let metaTitle = "";
    if (parts.length === 1) metaTitle = `\u201c${parts[0]}\u201d on ${append}`;
    if (parts.length === 2 || parts.length === 3)
      metaTitle = `\u201c${parts[0]}\u201d in \u201c${parts[1]}\u201d on ${append}`;
    let sectionDescription = text.attributes.description;
    if (!sectionDescription)
      sectionDescription = `Start reading this text on ${append}.`;

    return (
      <>
        <EventTracker
          event={EVENTS.VIEW_RESOURCE}
          resource={this.props.section}
        />
        {this.renderStyles(this.props)}
        <HeadContent
          title={metaTitle}
          image={section.attributes.socialImage}
          description={sectionDescription}
        />
        {this.renderRoutes()}
        <Section.Text {...this.props} />
        <div>
          <Section.NextSection
            sectionsMap={text.attributes.sectionsMap}
            text={text}
            sectionId={this.props.section.id}
            typography={this.props.appearance.typography}
          />
          <Section.Pagination
            text={text}
            sectionId={this.props.section.id}
            spine={text.attributes.spine}
          />
        </div>
        {this.showLabel() && (
          <Section.Label
            label={get(text, "relationships.category.attributes.title")}
          />
        )}
      </>
    );
  }
}

export default connectAndFetch(withSettings(SectionContainer));
