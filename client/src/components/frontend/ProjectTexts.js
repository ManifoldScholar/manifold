import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ProjectTexts extends Component {

  static propTypes = {};

  render = () => {
    return (
        <div>
          <section>
            <h4 className="sub-section-heading">
              {'Published Version'}
            </h4>
            <ul className="asset-list">
              <li>
                <div className="project-asset">
                  <Link to="/" className="asset-link">
                    <figure className="asset-image">
                      <i className="manicon manicon-new"></i>
                      <img src="/placeholder/browse-pCover-nornes01.jpg"/>
                    </figure>

                    <div className="asset-description">
                      <h3 className="asset-title">
                        Japanese Documentary Film
                      <span className="subtitle">
                        The Meiji Era through Hiroshima
                      </span>
                      </h3>
                      <datetime className="asset-date">
                        {'Added September 29, 2015'}
                      </datetime>
                    </div>
                  </Link>

                  <div className="asset-status">
                    <div className="asset-completion">
                       <div className="complete" style={{width: '28%'}}></div>
                    </div>

                    <ul className="asset-interactions">
                      <li>
                        <Link to="/">
                          <i className="manicon manicon-highlight"></i>
                          12
                        </Link>
                      </li>
                      <li>
                        <Link to="/">
                          <i className="manicon manicon-person-word-bubble"></i>
                          31
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </section>
          <section>
            <h4 className="sub-section-heading">
              {'Drafts'}
            </h4>
            <ul className="asset-list">
              <li>
                <div className="project-asset">
                  <Link to="/" className="asset-link">
                    <figure className="asset-image">
                      <div className="asset-image-placeholder">
                        {/* And icon will go in here */}
                      </div>
                    </figure>

                    <div className="asset-description">
                      <h3 className="asset-title">
                        Healing the Watershed of the Coaster Brook Trout
                      <span className="subtitle">
                        The Meiji Era through Hiroshima
                      </span>
                      </h3>
                      <datetime className="asset-date">
                        {'Added September 29, 2015'}
                      </datetime>
                    </div>
                  </Link>

                  <div className="asset-status">
                    <div className="asset-completion">
                      <div className="complete" style={{width: '18%'}}></div>
                    </div>

                    <ul className="asset-interactions">
                      <li>
                          <i className="manicon manicon-highlight"></i>
                      </li>
                      <li>
                          <i className="manicon manicon-person-word-bubble"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <div className="project-asset">
                  <Link to="/" className="asset-link">
                    <figure className="asset-image">
                      <div className="asset-image-placeholder">
                        {/* And icon will go in here */}
                      </div>
                    </figure>

                    <div className="asset-description">
                      <h3 className="asset-title">
                        The Women of Bakken
                      <span className="subtitle">
                        Lorem ipsum Dolor sit amet
                      </span>
                      </h3>
                      <datetime className="asset-date">
                        {'Added September 29, 2015'}
                      </datetime>
                    </div>
                  </Link>

                  <div className="asset-status">
                    <div className="asset-completion">
                      <div className="complete" style={{width: '0%'}}></div>
                    </div>

                    <ul className="asset-interactions">
                      <li>
                        <Link to="/">
                          <i className="manicon manicon-highlight"></i>
                          178
                        </Link>
                      </li>
                      <li>
                        <i className="manicon manicon-person-word-bubble"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <div className="project-asset">
                  <Link to="/" className="asset-link">
                    <figure className="asset-image">
                      <div className="asset-image-placeholder">
                        {/* And icon will go in here */}
                      </div>
                    </figure>

                    <div className="asset-description">
                      <h3 className="asset-title">
                        Chapter One
                      <span className="subtitle">
                        Bodies, Subjects, and Struggles in the Bakken Oil Boom
                      </span>
                      </h3>
                      <datetime className="asset-date">
                        {'Added September 29, 2015'}
                      </datetime>
                    </div>
                  </Link>

                  <div className="asset-status">
                    <div className="asset-completion">
                      <div className="complete" style={{width: '100%'}}></div>
                    </div>

                    <ul className="asset-interactions">
                      <li>
                        <i className="manicon manicon-highlight"></i>
                      </li>
                      <li>
                        <Link to="/">
                          <i className="manicon manicon-person-word-bubble"></i>
                          5
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>
    );
  };
}
