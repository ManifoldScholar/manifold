import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Settings } from 'components/backend';
import get from 'lodash/get';

class SettingsWrapperContainer extends PureComponent {

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  render() {
    return (
      <div>
        <section>
          <div className="container">
            <section className="backend-panel">
              <aside>
                <Settings.Navigation
                  active={this.activeChild()}
                />
              </aside>
              <div className="panel">
                {this.props.children}
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }

}

export default connect(
  SettingsWrapperContainer.mapStateToProps
)(SettingsWrapperContainer);

