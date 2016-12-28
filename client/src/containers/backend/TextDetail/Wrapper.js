import React, { PureComponent, PropTypes } from 'react';
import { Text, Navigation } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { textsAPI } from 'api';
import get from 'lodash/get';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class TexDetailWrapperContainer extends PureComponent {

  static displayName = "TextDetail.Wrapper";

  static mapStateToProps(state, ownProps) {
    return {
      text: select(requests.showTextDetail, state.entityStore)
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
    this.props.dispatch(entityStoreActions.flush(requests.showTextDetail));
  }

  fetchText() {
    const call = textsAPI.show(this.props.params.id);
    const textRequest = request(call, requests.showTextDetail);
    this.props.dispatch(textRequest);
  }

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
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
        <section>
          <div className="container">
            <section className="backend-panel">
              <aside>
                <Text.Navigation
                  text={text}
                  active={this.activeChild()}
                />
              </aside>
              <div className="panel">
                {React.cloneElement(this.props.children, { text })}
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(
  TexDetailWrapperContainer.mapStateToProps
)(TexDetailWrapperContainer);

