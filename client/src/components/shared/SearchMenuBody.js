import React, { Component } from 'react';

export default class UserButton extends Component {

  render() {
    return (
      <nav className="search-menu">
        <i className="tail"></i>
        <form>
          <div className="input-magnify">
            <input type="text" placeholder={'Search for...'}/>
            <button className="manicon manicon-magnify"></button>
          </div>
          <div className="filters">
            <label>{'Search within:'}</label>
            <label className="checkbox">
              <input type="checkbox"/>
              {/* Fake control to allow for custom checkbox styles */}
              <div className="control-indicator">
                <i className="manicon manicon-check"></i>
              </div>
              {'Chapter'}
            </label>
            <label className="checkbox">
              <input type="checkbox"/>
              {/* Fake control to allow for custom checkbox styles */}
              <div className="control-indicator">
                <i className="manicon manicon-check"></i>
              </div>
              {'Text'}
            </label>
            <label className="checkbox">
              <input type="checkbox"/>
              {/* Fake control to allow for custom checkbox styles */}
              <div className="control-indicator">
                <i className="manicon manicon-check"></i>
              </div>
              {'Project'}
            </label>
          </div>
        </form>
      </nav>
    );
  }
}
