import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Link } from 'react-router';

export default class ProjcetPanelTexts extends Component {

  static displayName = "Project.Panel.Texts";

  static propTypes = {};

  render() {
    return (
      <section>
        <section className="">
          <div className="text-category">
            <div className=" accent">
              Published
              <div className="utility">
                <button>{'Edit'}</button>
                <button><i className="manicon manicon-arrow-up"></i></button>
                <button><i className="manicon manicon-arrow-down"></i></button>
                <button><i className="manicon manicon-arrow-x"></i></button>
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }
}
