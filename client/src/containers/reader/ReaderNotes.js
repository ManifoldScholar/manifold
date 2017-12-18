import React, { Component } from "react";
import { Utility } from "components/global";
import PropTypes from "prop-types";
import { Notes } from "components/reader";
import { Overlay } from "components/global";
import lh from "helpers/linkHandler";
import { annotationsAPI, meAPI, requests } from "api";
import { select, grab } from "utils/entityUtils";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { commonActions } from "actions/helpers";
import groupBy from "lodash/groupBy";
import isString from "lodash/isString";

const { request } = entityStoreActions;

const INITIAL_FORMATS = ["highlight", "annotation", "bookmark"];

export class ReaderNotesContainer extends Component {
  static displayName = "Reader.ReaderNotes";

  static mapStateToProps = (state, ownProps) => {
    const requestName = ownProps.filterable
      ? requests.rMyFilteredAnnotationsForText
      : requests.rMyAnnotationsForText;

    const newState = {
      myAnnotations: select(requestName, state.entityStore) || null,
      text: grab("texts", ownProps.match.params.textId, state.entityStore),
      section: grab(
        "textSections",
        ownProps.match.params.sectionId,
        state.entityStore
      )
    };
    return Object.assign({}, newState, ownProps);
  };

  static propTypes = {
    myAnnotations: PropTypes.array,
    annotations: PropTypes.array,
    filterable: PropTypes.bool,
    section: PropTypes.object,
    text: PropTypes.object,
    visible: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    children: PropTypes.object
  };

  static defaultProps = {
    filterable: false
  };

  constructor(props) {
    super(props);
    this.state = this.setInitialState(props);
    this.requestName = this.getRequestName(props);
  }

  componentWillMount() {
    this.commonActions = commonActions(this.props.dispatch);
  }

  componentDidMount() {
    if (this.props.myAnnotations) return null;
    this.fetchAnnotations(this.state, this.props);
  }

  getRequestName(props) {
    if (props.filterable) return requests.rMyFilteredAnnotationsForText;
    return requests.rMyAnnotationsForText;
  }

  fetchAnnotations(state, props) {
    const annotationsCall = meAPI.annotations(state.filter);
    props.dispatch(request(annotationsCall, requests.rMyAnnotationsForText));
  }

  getSectionName(text, sectionId) {
    const attrs = text.attributes;
    const section = attrs.sectionsMap.find(s => s.id === sectionId);
    if (!section) return null;
    return section.name;
  }

  setInitialState = props => {
    return {
      filter: {
        text: props.text.id,
        formats: [...INITIAL_FORMATS]
      }
    };
  };

  triggerHideNotes = () => {
    this.commonActions.panelToggle("notes");
  };

  fetchAnnotations(state, props) {
    const annotationsCall = meAPI.annotations(state.filter);
    props.dispatch(request(annotationsCall, this.requestName));
  }

  handleVisitAnnotation = annotation => {
    const { match, history } = this.props;
    const attr = annotation.attributes;
    const url = lh.link(
      "readerSection",
      match.params.textId,
      attr.textSectionId,
      `#annotation-${annotation.id}`
    );

    this.triggerHideNotes();
    return history.push(url);
  };

  handleSeeAllClick = event => {
    event.preventDefault();
    const { match, history } = this.props;
    const url = lh.link(
      "readerSection",
      match.params.textId,
      match.params.sectionId,
      "#my-annotations"
    );

    return history.push(url);
  };

  handleUpdateAnnotation = annotation => {
    const call = annotationsAPI.update(annotation.id, annotation);
    const res = this.props.dispatch(request(call, requests.rAnnotationUpdate));
    return res.promise;
  };

  handleDeleteAnnotation = annotation => {
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    return res.promise;
  };

  handleFilterChange = (key, filters) => {
    const filter = Object.assign({}, this.state.filter);
    filter[key] = filters;
    this.setState({ filter }, () => this.fetchAnnotations(this.state, this.props));
  };

  mapAnnotationsToSections(props) {
    const { text, myAnnotations } = props;
    const annotationGroups = groupBy(
      myAnnotations,
      "attributes.textSectionId"
    );
    let out = [];

    text.attributes.spine.map(sectionId => {
      if (!annotationGroups[sectionId]) return null;
      return out.push({
        sectionId: sectionId,
        name: this.getSectionName(text, sectionId),
        annotations: annotationGroups[sectionId]
      });
    });

    return out;
  }

  childProps(props) {
    const sortedAnnotations = this.mapAnnotationsToSections(props);

    return {
      sortedAnnotations,
      annotations: props.annotations,
      section: props.section,
      handleUpdateAnnotation: this.handleUpdateAnnotation,
      handleDeleteAnnotation: this.handleDeleteAnnotation,
      handleVisitAnnotation: this.handleVisitAnnotation,
      handleFilterChange: this.handleFilterChange,
      handleSeeAllClick: this.handleSeeAllClick,
      visible: props.visible,
      filter: this.state.filter
    }
  }

  renderChildren() {
    if (!this.props.children) return null;
    if (isString(this.props.children.type)) return this.props.children;
    return React.cloneElement(this.props.children, this.childProps(this.props));
  }

  render() {
    return this.renderChildren();
  }
}

export default connectAndFetch(ReaderNotesContainer);
