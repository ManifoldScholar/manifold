import React, { Component, PropTypes } from 'react';
import { Project, Layout } from 'components/backend';
import { connect } from 'react-redux';
import { Link } from 'react-router';

export default class BackendWrapper extends Component {
  // static mapStateToProps(state) {
  //   return {
  //     project: select(requests.showProjectDetail, state.entityStore)
  //   };
  // }

  static propTypes = {
    children: PropTypes.object
  };

  render() {
    return (
      <div>
        <Project.Header
          title="Japanese Documentary Film"
          subtitle="The Meiji Era through Hiroshima"
        />
        <section>
          <div className="container">
            <section className="backend-panel">
              <aside>
                <Layout.PanelNav/>
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
