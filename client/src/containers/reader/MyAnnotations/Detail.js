import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { annotationsAPI, requests } from "api";
import { select, isLoaded } from "utils/entityUtils";
import { entityStoreActions } from "actions";
import { MyAnnotations } from "components/reader";
import rcc from "helpers/readerControlClasses";

const { request, flush } = entityStoreActions;

export class MyAnnotationsDetailContainer extends Component {
  static displayName = "ReaderContainer.MyAnnotations.Detail";

  static fetchData = (getState, dispatch, location, match) => {
    const state = getState();
    const promises = [];
    const { textId } = match.params;
    const annotationsLoaded = isLoaded("annotations", state);
    if (!annotationsLoaded) {
      const annotationsCall = annotationsAPI.forMe({ text: textId });
      const { promise: one } = dispatch(
        request(annotationsCall, requests.rUserAnnotations)
      );
      promises.push(one);
    }
    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      annotations: select(requests.rUserAnnotations, state.entityStore)
    };
  };

  static propTypes = {
    annotations: PropTypes.array,
    dispatch: PropTypes.func,
    appearance: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rUserAnnotations));
  }

  render() {
    if (!this.props.annotations) return null;

    const readerClasses = rcc.readerClasses(
      this.props.appearance.colors.colorScheme
    );
    let containerClasses = rcc.containerClasses(
      this.props.appearance.typography.margins
    );
    containerClasses += " user-annotations";

    return (
      <section className={readerClasses}>
        <div className={containerClasses}>
          <MyAnnotations.List
            annotations={this.props.annotations}
            appearance={this.props.appearance}
            dispatch={this.props.dispatch}
          />
        </div>
      </section>
    );
  }
}

export default connectAndFetch(MyAnnotationsDetailContainer);
