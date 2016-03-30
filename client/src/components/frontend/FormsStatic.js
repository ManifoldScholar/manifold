import React, { Component } from 'react';

export default class FormsStatic extends Component {
  render() {
    return (
        <div>
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
                  Hi
                </div>
              </div>
            </div>
          </section>
        </div>
    );
  }
}
