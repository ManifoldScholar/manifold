import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Makers extends Component {

  static displayName = "From.Makers";

  static propTypes = {
    label: PropTypes.string,
    makers: PropTypes.object
  };

  constructor() {
    super();
    this.renderOrderButton = this.renderOrderButton.bind(this);
  }

  renderOrderButton(direction, ordinal, maker) {
    let output = null;

    const buttonClass = classNames({
      manicon: true,
      'manicon-arrow-up': direction === 'up',
      'manicon-arrow-down': direction === 'down'
    });
    if (direction === 'up' && ordinal !== 0
        || direction === 'down' && ordinal !== this.props.makers.length - 1) {
      // Avatar can be moved up, output up button
      output = (
        <button className={buttonClass}>
          <span className="screen-reader-text">
            Click to move {maker.attributes.name} up in the order of makers.
          </span>
        </button>
      );
    }

    console.log(output, 'button output');

    return output;
  }

  render() {
    const makers = this.props.makers;

    return (
      <div className="form-input">
        <label>{this.props.label}</label>
        <nav className="maker-utility-list">
          <ul>
            {makers.map((maker, index) => {
              return (
                <li>
                  <div className="maker">
                    <figure>
                      <img src={maker.avatar} />
                    </figure>

                    <h4 className="maker-name">
                      {maker.attributes.name}
                    </h4>
                  </div>

                  <div className="utility">
                    {this.renderOrderButton('up', index, maker)}
                    {this.renderOrderButton('down', index, maker)}
                    <button className="manicon manicon-x">
                      <span className="screen-reader-text">
                        Click to remove {maker.attributes.name} from the makers list.
                      </span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {/* Add .autofill-open to .maker-add in order to show autofill list  */}
          <div className="maker-add">
            <button className="manicon manicon-plus"></button>
            <input type="text" placeholder="Add an Author"></input>
            <button className="new">
              {'Create New'}
            </button>
            {
              /* Note: This list is hidden by default, and can be shown
              conditionally with the class above  */
            }
            <nav className="autofill-list">
              <ul>
                <li>
                  {'Catherine E. Smithwick'}
                </li>
                <li>
                  {'Catherine Mooney'}
                </li>
                <li>
                  {'Catherie Glisan Flavel'}
                </li>
                <li>
                  {'Catherine Lafayette Kenilworth'}
                </li>
                <li>
                  {'Catherine Ankeny'}
                </li>
              </ul>
            </nav>
          </div>
        </nav>
      </div>
    );
  }

}
