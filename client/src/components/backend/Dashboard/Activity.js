import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Activity extends Component {

  static displayName = "Dashboard.Activity";

  static propTypes = {
    statistics: PropTypes.shape({
      attributes: PropTypes.shape({
        newTextsCount: PropTypes.number,
        readersThisWeek: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.number
        ]),
        readerIncrease: PropTypes.number,
        newHighlightsCount: PropTypes.number,
        newAnnotationsCount: PropTypes.number
      })
    })
  };

  formatReaderIncrease(stats) {
    const increase = stats.readerIncrease;

    if (increase === null) return "";
    if (increase > 0) return "+ " + increase.toString() + "%";
    if (increase < 0) return "- " + Math.abs(increase).toString() + "%";
    return "0" + "%";
  }


  render() {
    if (!this.props.statistics) return null;
    const stats = this.props.statistics.attributes;

    return (
      <table className="table-single-value">
        <tbody>
          <tr>
            <td>Texts added this week</td>
            <td>{stats.newTextsCount}</td>
          </tr>
          { stats.readersThisWeek !== null ?
            <tr>
              <td>Readers this week</td>
              <td>{stats.readersThisWeek}</td>
            </tr>
          : null }
          { stats.readerIncrease != null ?
            <tr>
              <td>Change from last week</td>
              <td>{this.formatReaderIncrease(stats)}</td>
            </tr>
          : null }
          <tr>
            <td>Highlights in the past week</td>
            <td>{stats.newHighlightsCount}</td>
          </tr>
          <tr>
            <td>Annotations in the past week</td>
            <td>{stats.newAnnotationsCount}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}
