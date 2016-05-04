import React, { Component } from 'react';

export default class FormsStatic extends Component {
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
          <section className="bg-neutral05">
            <div className="container">
              <h4 className="section-heading">
                Assorted form elements
              </h4>

              <div className="row-3-p">
                <div className="col-33">
                  <div className="form-input">
                    <label>Text Entry Field</label>
                    <input type="text" placeholder="Text Entry Field" />
                  </div>
                </div>

                <div className="col-33">
                  <div className="form-input">
                    <label>Text Entry Field</label>
                    <input type="text" placeholder="Text Entry Field" />
                  </div>
                </div>

                <div className="col-33">
                  <div className="form-input">
                    <label>&nbsp;</label>
                    <div className="form-select">
                      <i className="manicon manicon-caret-down"></i>
                      <select>
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
                    <label>Editable text field</label>
                    <textarea placeholder="Start typing annotation here..."></textarea>
                  </div>
                </div>

                <div className="col-33">
                  <div className="form-callout">
                    <header>
                      <i className="manicon manicon-bugle"></i>
                      Notifications
                    </header>

                    <div className="form-input">
                      <label className="form-toggle radio annotated">
                        <input type="radio" name="notifications"/>
                      <span className="toggle-indicator"></span>
                        Please Opt Me In
                        <span className="toggle-note">
                          I have always been very upset when I am left out of the group.
                          This goes double for newsletters,  promotional offers,
                          and targeted advertising.
                        </span>
                      </label>

                      <label className="form-toggle radio annotated">
                        <input type="radio" name="notifications"/>
                      <span className="toggle-indicator"></span>
                        None of your bee's wax
                        <span className="toggle-note">
                          I have several suggestions for where I would most like to see
                          your newsletter delivered, none of which include my email address.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="form-input">
                    <label>Checkboxes Vertical</label>
                    {/* Radio buttons and checkboxes get wrapped in a toggle class */}
                    <label className="form-toggle checkbox">
                      <input type="checkbox"/>
                      <span className="toggle-indicator">
                        {/*
                          Checkboxes, and radio buttons require a .toggle-indicator in order
                          to display a checkbox or radio button. Additionally, checkboxes
                          require a "check" icon that is shown/hidden conditionally by
                          the state of the element.
                        */}
                        <i className="manicon manicon-check"></i>
                      </span>
                      Checkbox item
                    </label>
                    <label className="form-toggle checkbox">
                      <input type="checkbox"/>
                      <span className="toggle-indicator">
                        <i className="manicon manicon-check"></i>
                      </span>
                      Checkbox item
                    </label>
                    <label className="form-toggle checkbox">
                      <input type="checkbox"/>
                      <span className="toggle-indicator">
                        <i className="manicon manicon-check"></i>
                      </span>
                      Checkbox item
                    </label>
                  </div>

                  <div className="form-input">
                    <label>Radios Vertical</label>
                    <label className="form-toggle radio">
                      <input type="radio" name="test"/>
                      <span className="toggle-indicator">
                        {/* Radio Buttons don't have/require a check icon */}
                      </span>
                      Radio item
                    </label>

                    <label className="form-toggle radio">
                      <input type="radio" name="test"/>
                      <span className="toggle-indicator">
                      </span>
                      Radio item
                    </label>

                    <label className="form-toggle radio">
                      <input type="radio" name="test"/>
                      <span className="toggle-indicator">
                      </span>
                      Radio item
                    </label>
                  </div>
                </div>
              </div>

              <div className="row-3-p">
                <div className="col-66">
                  <div className="form-input">
                    <label>Checkboxes Horizontal</label>

                    <label className="form-toggle checkbox horizontal">
                      <input type="checkbox"/>
                        <span className="toggle-indicator">
                          <i className="manicon manicon-check"></i>
                        </span>
                      Checkbox item
                    </label>

                    <label className="form-toggle checkbox horizontal">
                      <input type="checkbox"/>
                        <span className="toggle-indicator">
                          <i className="manicon manicon-check"></i>
                        </span>
                      Checkbox item
                    </label>

                    <label className="form-toggle checkbox horizontal">
                      <input type="checkbox"/>
                        <span className="toggle-indicator">
                          <i className="manicon manicon-check"></i>
                        </span>
                      Checkbox item
                    </label>
                  </div>

                  <div className="form-input">
                    <label>Checkboxes Horizontal</label>

                    <label className="form-toggle radio horizontal">
                      <input type="radio"/>
                        <span className="toggle-indicator">
                        </span>
                      Checkbox item
                    </label>

                    <label className="form-toggle radio horizontal">
                      <input type="radio"/>
                        <span className="toggle-indicator">
                        </span>
                      Checkbox item
                    </label>

                    <label className="form-toggle radio horizontal">
                      <input type="radio"/>
                        <span className="toggle-indicator">
                        </span>
                      Checkbox item
                    </label>
                  </div>
                </div>
              </div>

              <div className="row-3-p">
                <div className="col-33">
                  {/* Use button-secondary-dull when button is disabled */}
                  <div className="form-input">
                    <input type="submit" className="button-secondary-dull" disabled />
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
