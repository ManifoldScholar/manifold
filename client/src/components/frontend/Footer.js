import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Footer extends Component {

  static propTypes = {};

  render = () => {
    return (
        <footer className="footer-browse">
          <div className="container">
            <div className="rel">
              <Link to={'/browse'} className="logo">
                <i className="manicon manicon-manifold-logo"></i>
                {'Manifold'}
              </Link>
            </div>
            <nav className="text-nav">
              <ul>
                <li>
                  <ul>
                    <li>
                      <a href="#">
                        {'Log In'}
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        {'Projects'}
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        {'About'}
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <ul>
                    <li>
                      <a href="#">
                        {'Publishers'}
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        {'Terms'}
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        {'Contact'}
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <ul>
                    <li>
                      <a href="#">
                        {'Twitter'}
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        {'Facebook'}
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        {'Email'}
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>

            <section className="footer-secondary">
              <form>
                <div className="search-button-inline">
                  <input type="text" placeholder="Search"/>
                  <button className="manicon manicon-magnify">
                    <span className="screen-reader-text">Click to submit search query</span>
                  </button>
                </div>
              </form>
              <p className="colophon">
                {'Search © 2016 Manifold. Vestibulum id ligula porta felis '}
                <Link to="{#}">
                  {'euismod semper'}
                </Link>
                {'. Vivamus sagittis lacus vel.Twitter'}
              </p>
            </section>
          </div>
        </footer>
    );
  };
}
