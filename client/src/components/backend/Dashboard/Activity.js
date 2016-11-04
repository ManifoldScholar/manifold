import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Activity extends Component {

  static displayName = "Dashboard.Activity";

  static propTypes = {};

  render() {
    return (
      <table className="table-single-value">
        <tr>
          <td>Texts added this week</td>
          <td>2</td>
        </tr>
        <tr>
          <td>Readers this weeks</td>
          <td>2349</td>
        </tr>
        <tr>
          <td>Increase from last week</td>
          <td>17%+</td>
        </tr>
        <tr>
          <td>Highlights in the past week</td>
          <td>2914</td>
        </tr>
        <tr>
          <td>Annotations in the past week</td>
          <td>455</td>
        </tr>
        <tr>
          <td>Comments in the past week</td>
          <td>650</td>
        </tr>
      </table>
    );
  }
}
