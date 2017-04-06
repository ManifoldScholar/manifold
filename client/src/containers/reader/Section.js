import React, { Component, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Section } from 'components/reader';
import { sectionsAPI, requests } from 'api';
import { select, grab, isEntityLoaded } from 'utils/entityUtils';
import { entityStoreActions } from 'actions';
const { request } = entityStoreActions;
import { renderRoutes } from 'helpers/routing';

class SectionContainer extends Component {

  static fetchData(getState, dispatch, location, match) {
    const state = getState();
    const promises = [];
    const { sectionId } = match.params;
    const sectionLoaded = sectionId ? isEntityLoaded('textSections', sectionId, state) : false;

    if (sectionId && !sectionLoaded) {
      const sectionCall = sectionsAPI.show(sectionId);
      const { promise: two } = dispatch(request(sectionCall, requests.rSection));
      promises.push(two);
    }
    return Promise.all(promises);
  }

  static mapStateToProps(state, ownProps) {
    return {
      section: grab("textSections", ownProps.match.params.sectionId, state.entityStore)
    };
  }

  static propTypes = {
    section: PropTypes.object,
    route: PropTypes.object.isRequired,
    text: PropTypes.object.isRequired,
    appearance: PropTypes.object.isRequired
  };

  render() {
    if (!this.props.section) return null;

    return (
      <div>
        {renderRoutes(this.props.route.routes)}
        <Section.Text {...this.props} />
        <Section.Label text={this.props.text} />
        <div>
          <Section.NextSection
            sectionsMap={this.props.text.attributes.sectionsMap}
            textId={this.props.text.id}
            sectionId={this.props.section.id}
            typography={this.props.appearance.typography}
          />
          <Section.Pagination
            textId={this.props.text.id}
            sectionId={this.props.section.id}
            spine={this.props.text.attributes.spine}
          />
        </div>
      </div>
    );
  }

}

export default connectAndFetch(SectionContainer);
