import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { meAPI, requests } from "api";
import { select } from "utils/entityUtils";
import HigherOrder from "containers/global/HigherOrder";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { MineForText as MineForTextComponents } from "components/reader";
import groupBy from "lodash/groupBy";

const { request } = entityStoreActions;

class MineForText extends PureComponent {
  static displayName = "Annotation.MineForText";

  static propTypes = {
    annotations: PropTypes.array,
    text: PropTypes.object.isRequired,
    closeDrawer: PropTypes.func,
    sectionId: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  };

  static defaultProps = {
    annotations: []
  };

  static mapStateToProps = (state, ownProps) => {
    const newState = {
      annotations:
        select(requests.rMyAnnotationsForText, state.entityStore) || []
    };
    return Object.assign({}, newState, ownProps);
  };

  componentDidMount() {
    this.fetchAnnotations(this.props);
  }

  getSectionName(text, sectionId) {
    const attrs = text.attributes;
    const section = attrs.sectionsMap.find(s => s.id === sectionId);
    if (!section) return null;
    return section.name;
  }

  fetchAnnotations(props) {
    const tId = this.props.text.id;
    const annotationsCall = meAPI.annotations({
      text: tId
    });
    props.dispatch(request(annotationsCall, requests.rMyAnnotationsForText));
  }

  render() {
    const text = this.props.text;
    const annotationGroups = groupBy(
      this.props.annotations,
      "attributes.textSectionId"
    );
    return (
      <div>
        {text.attributes.spine.map(sectionId => {
          if (!annotationGroups[sectionId]) return null;
          return (
            <MineForTextComponents.List
              key={sectionId}
              annotations={annotationGroups[sectionId]}
              header={this.getSectionName(this.props.text, sectionId)}
              dispatch={this.props.dispatch}
            />
          );
        })}
      </div>
    );
  }
}
export { MineForText as MineForTextContainer }; // unconnected for testing
export default connectAndFetch(HigherOrder.withCurrentUser(MineForText));
