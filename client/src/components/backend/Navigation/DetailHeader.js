import React, { PureComponent, PropTypes } from 'react';
import { Navigation } from 'components/backend';

export default class DetailHeader extends PureComponent {

  static displayName = "Navigation.DetailHeader";

  static propTypes = {
    breadcrumb: PropTypes.array,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
  };

  render() {
    const breadcrumb = this.props.breadcrumb;
    return (
      <section className="bg-neutral95">
        {breadcrumb && breadcrumb.length > 0 ?
          <Navigation.Breadcrumb links={this.props.breadcrumb} />
          : null
        }
        <div className="container flush">
          <header className="project-header">
            <figure>
              <i className={`manicon manicon-${this.props.type}-placeholder`}></i>
            </figure>
            <div className="project-title">
              <h1>
                {this.props.title}
                <span className="subtitle">
                  {this.props.subtitle}
                </span>
              </h1>
              <div className="project-utility">
                <button
                  onClick={() => { alert("Under construction"); }}
                  className="button-bare-primary"
                >
                  Preview <i className="manicon manicon-eye-outline"></i>
                </button>
                <button
                  onClick={() => { alert("Under construction"); }}
                  className="button-bare-primary"
                >
                  Duplicate <i className="manicon manicon-check-double"></i>
                </button>
                <button
                  onClick={() => { alert("Under construction"); }}
                  className="button-bare-primary"
                >
                  Delete <i className="manicon manicon-trashcan"></i>
                </button>
              </div>
            </div>
          </header>
        </div>
      </section>
    );
  }
}
