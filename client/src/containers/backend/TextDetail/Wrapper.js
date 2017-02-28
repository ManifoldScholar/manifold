import React, { PureComponent, PropTypes } from 'react';
import { Text, Navigation } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { textsAPI } from 'api';
import get from 'lodash/get';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class TextDetailWrapperContainer extends PureComponent {

  static displayName = "TextDetail.Wrapper";

  static mapStateToProps(state, ownProps) {
    return {
      text: select(requests.beText, state.entityStore)
    };
  }

  static propTypes = {
    children: PropTypes.object,
    text: PropTypes.object
  };

  componentDidMount() {
    this.fetchText();
  }

  componentWillUnmount() {
    this.props.dispatch(entityStoreActions.flush(requests.beText));
  }

  fetchText() {
    const call = textsAPI.show(this.props.params.id);
    const textRequest = request(call, requests.beText);
    this.props.dispatch(textRequest);
  }

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  secondaryNavigationLinks(text) {
    return [
      {
        path: `/backend/text/${text.id}/`,
        label: "General",
        key: "general"
      },
      {
        path: `/backend/text/${text.id}/collaborators`,
        label: "People",
        key: "collaborators"
      },
      // {
      //   path: `/backend/text/${text.id}/ingestion`,
      //   label: "Ingestion",
      //   key: "ingestion"
      // },
      // {
      //   path: `/backend/text/${text.id}/sections`,
      //   label: "Sections",
      //   key: "sections"
      // },
      {
        path: `/backend/text/${text.id}/metadata`,
        label: "Metadata",
        key: "metadata"
      }
    ];
  }

  render() {
    if (!this.props.text) return null;
    const { text } = this.props;

    return (
      <div>
        <Navigation.DetailHeader
          type="text"
          breadcrumb={[
            { path: "/backend", label: "ALL PROJECTS" },
            {
              path: `/backend/project/${text.relationships.project.id}/texts`,
              label: text.relationships.project.attributes.title
            }
          ]}
          title={text.attributes.title}
          subtitle={text.attributes.subtitle}
        />
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(text)}
                active={this.activeChild()}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(text)}
                active={this.activeChild()}
              />
            </aside>
            <div className="panel">
              {React.cloneElement(this.props.children, { text })}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(
  TextDetailWrapperContainer.mapStateToProps
)(TextDetailWrapperContainer);

