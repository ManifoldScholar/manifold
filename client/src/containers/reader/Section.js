import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Section } from "components/reader";
import {
  sectionsAPI,
  annotationsAPI,
  resourcesAPI,
  collectionsAPI,
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
import { HeadContent } from "components/global";
import HigherOrder from "containers/global/HigherOrder";

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
    collections: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    text: PropTypes.object.isRequired,
    appearance: PropTypes.object.isRequired
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
    // Check if we need to fetch more resources when annotations change
    // Needs to be deep comparison
    if (!isEqual(prevProps.annotations, this.props.annotations)) {
      const missing = this.hasMissingResourcesOrCollections(
        this.props.annotations,
        this.props.resources,
        this.props.collections
      );
      if (missing) {
        if (some(missing, ["type", "resource"])) {
          this.fetchResources(this.props);
        }
        if (some(missing, ["type", "collection"])) {
          this.fetchCollections(this.props);
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rSection));
    this.props.dispatch(flush(requests.rSectionResources));
    this.props.dispatch(flush(requests.rSectionCollections));
  }

  fetchAnnotations(props) {
    const annotationsCall = annotationsAPI.forSection(
      props.match.params.sectionId
    );
    props.dispatch(request(annotationsCall, requests.rAnnotations));
  }

  fetchResources(props) {
    const resourcesCall = resourcesAPI.forSection(props.match.params.sectionId);
    props.dispatch(request(resourcesCall, requests.rSectionResources));
  }

  fetchCollections(props) {
    const collectionsCall = collectionsAPI.forSection(
      props.match.params.sectionId
    );
    props.dispatch(request(collectionsCall, requests.rSectionCollections));
  }

  hasMissingResourcesOrCollections(annotations, resourcesIn, collectionsIn) {
    if (!annotations) return;
    const resources = resourcesIn || [];
    const collections = collectionsIn || [];
    const needed = uniq(
      annotations
        .map(a => {
          return {
            id: a.attributes.resourceId || a.attributes.collectionId,
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

  render() {
    if (!this.props.section || !this.props.text) return null;
    const { text, section, settings, appearance } = this.props;
    const { project } = text.relationships;
    const projectImage = project ? project.attributes.heroStyles.medium : null;
    const textTitle = text.attributes.title;
    const sectionTitle = section.attributes.name;
    const projectTitle = project.attributes.title;

    const parts = remove(
      uniq([sectionTitle, textTitle, projectTitle]),
      v => !isNil(v)
    );
    const append = settings.attributes.general.installationName;
    let metaTitle = "";
    if (parts.length === 1) metaTitle = `\u201c${parts[0]}\u201d on ${append}`;
    if (parts.length === 2 || parts.length === 3)
      metaTitle = `\u201c${parts[0]}\u201d in \u201c${
        parts[1]
      }\u201d on ${append}`;
    let sectionDescription = text.attributes.description;
    if (!sectionDescription)
      sectionDescription = `Start reading this text on ${append}.`;

    return (
      <div>
        <HeadContent
          title={metaTitle}
          image={projectImage}
          description={sectionDescription}
        />
        {childRoutes(this.props.route)}
        <Section.Text {...this.props} />
        <div>
          <Section.NextSection
            sectionsMap={text.attributes.sectionsMap}
            text={text}
            sectionId={this.props.section.id}
            typography={this.props.appearance.typography}
            colors={appearance.colors}
          />
          <Section.Pagination
            text={text}
            sectionId={this.props.section.id}
            spine={text.attributes.spine}
          />
        </div>
        {this.showLabel() ? (
          <Section.Label
            label={get(text, "relationships.category.attributes.title")}
          />
        ) : null}
      </div>
    );
  }
}

export default connectAndFetch(HigherOrder.withSettings(SectionContainer));
