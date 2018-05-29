import React, { Component } from "react";

export default class StaticForm extends Component {
  static displayName = "Static.Form";

  render() {
    return (
      <div>
        {/*
          Background color can be adjusted by section and form
          appearance will follow suit. Options:
          blank (white)
          bg-neutral05 (light gray)
          bg-neutral90 (off black)
        */}
        <section>
          <div className="container">
            <h4 className="section-heading">Assorted form elements</h4>

            <div className="row-3-p">
              <div className="col-33">
                <div className="form-input form-error">
                  <label htmlFor="text-1">Text Entry Field</label>
                  <input
                    id="text-1"
                    type="text"
                    placeholder="Text Entry Field"
                  />
                  <i className="manicon manicon-stop" aria-hidden="true" />
                  <span className="form-error-message">something happened</span>
                </div>
              </div>

              <div className="col-33">
                <div className="form-input">
                  <label htmlFor="text-2">Text Entry Field</label>
                  <input
                    id="text-2"
                    type="text"
                    placeholder="Text Entry Field"
                  />
                </div>
              </div>

              <div className="col-33">
                <div className="form-input">
                  <label htmlFor="select-1">&nbsp;</label>
                  <div className="form-select">
                    <i
                      className="manicon manicon-caret-down"
                      aria-hidden="true"
                    />
                    <select id="select-1">
                      <option>Select Dropdown</option>
                      <option>Select an option</option>
                      <option>If you please</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="row-3-p">
              <div className="col-66">
                <div className="form-input">
                  <label htmlFor="textarea-1">Editable text field</label>
                  <textarea
                    id="textarea-1"
                    placeholder="Start typing annotation here..."
                  />
                </div>
              </div>

              <div className="col-33">
                <div className="form-callout">
                  <header>
                    <i className="manicon manicon-bugle" aria-hidden="true" />
                    Notifications
                  </header>

                  <div className="form-input">
                    <label className="form-toggle radio annotated">
                      <input type="radio" name="notifications" />
                      <span className="toggle-indicator" />
                      <span className="toggle-label">Please Opt Me In</span>
                      <span className="toggle-note">
                        I have always been very upset when I am left out of the
                        group. This goes double for newsletters, promotional
                        offers, and targeted advertising.
                      </span>
                    </label>

                    <label className="form-toggle radio annotated">
                      <input type="radio" name="notifications" />
                      <span className="toggle-indicator" />
                      <span className="toggle-label">
                        {"None of your bee's wax"}
                      </span>
                      <span className="toggle-note">
                        I have several suggestions for where I would most like
                        to see your newsletter delivered, none of which include
                        my email address.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="form-input">
                  <h4 className="form-input-heading">Checkboxes Vertical</h4>
                  {/* Radio buttons and checkboxes get wrapped in a toggle class */}
                  <label className="form-toggle checkbox">
                    <input type="checkbox" />
                    <span className="toggle-indicator" aria-hidden="true">
                      {/*
                        Checkboxes, and radio buttons require a .toggle-indicator in order
                        to display a checkbox or radio button. Additionally, checkboxes
                        require a "check" icon that is shown/hidden conditionally by
                        the state of the element.
                      */}
                      <i className="manicon manicon-check" />
                    </span>
                    <span className="toggle-label">Checkbox item</span>
                  </label>
                  <label className="form-toggle checkbox">
                    <input type="checkbox" />
                    <span className="toggle-indicator" aria-hidden="true">
                      <i className="manicon manicon-check" />
                    </span>
                    <span className="toggle-label">Checkbox item</span>
                  </label>
                  <label className="form-toggle checkbox">
                    <input type="checkbox" />
                    <span className="toggle-indicator" aria-hidden="true">
                      <i className="manicon manicon-check" />
                    </span>
                    <span className="toggle-label">Checkbox item</span>
                  </label>
                </div>

                <div className="form-input">
                  <h4 className="form-input-heading">Radios Vertical</h4>
                  <label className="form-toggle radio">
                    <input type="radio" name="test" />
                    <span className="toggle-indicator" aria-hidden="true">
                      {/* Radio Buttons don't have/require a check icon */}
                    </span>
                    <span className="toggle-label">Radio item</span>
                  </label>

                  <label className="form-toggle radio">
                    <input type="radio" name="test" />
                    <span className="toggle-indicator" aria-hidden="true" />
                    <span className="toggle-label">Radio item</span>
                  </label>

                  <label className="form-toggle radio">
                    <input type="radio" name="test" />
                    <span className="toggle-indicator" aria-hidden="true" />
                    <span className="toggle-label">Radio item</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="row-3-p">
              <div className="col-66">
                <div className="form-input">
                  <h4 className="form-input-heading">Checkboxes Horizontal</h4>

                  <label className="form-toggle checkbox horizontal">
                    <input type="checkbox" />
                    <span className="toggle-indicator" aria-hidden="true">
                      <i className="manicon manicon-check" />
                    </span>
                    <span className="toggle-label">Checkbox item</span>
                  </label>

                  <label className="form-toggle checkbox horizontal">
                    <input type="checkbox" />
                    <span className="toggle-indicator" aria-hidden="true">
                      <i className="manicon manicon-check" />
                    </span>
                    <span className="toggle-label">Checkbox item</span>
                  </label>

                  <label className="form-toggle checkbox horizontal">
                    <input type="checkbox" />
                    <span className="toggle-indicator" aria-hidden="true">
                      <i className="manicon manicon-check" />
                    </span>
                    <span className="toggle-label">Checkbox item</span>
                  </label>
                </div>

                <div className="form-input">
                  <h4 className="form-input-heading">Checkboxes Horizontal</h4>

                  <label className="form-toggle radio horizontal">
                    <input type="radio" />
                    <span className="toggle-indicator" aria-hidden="true" />
                    <span className="toggle-label">Checkbox item</span>
                  </label>

                  <label className="form-toggle radio horizontal">
                    <input type="radio" />
                    <span className="toggle-indicator" aria-hidden="true" />
                    <span className="toggle-label">Checkbox item</span>
                  </label>

                  <label className="form-toggle radio horizontal">
                    <input type="radio" />
                    <span className="toggle-indicator" aria-hidden="true" />
                    <span className="toggle-label">Checkbox item</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="row-3-p">
              <div className="col-33">
                {/* Use button-secondary-dull when button is disabled */}
                <div className="form-input">
                  <input
                    type="submit"
                    className="button-secondary-dull"
                    disabled
                  />
                  <input type="submit" className="button-secondary" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
