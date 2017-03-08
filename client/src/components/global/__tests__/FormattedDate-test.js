import React from 'react';
import TestUtils from 'react-addons-test-utils';
import FormattedDate from '../FormattedDate';

function setup(props) {
  let output = TestUtils.createRenderer().render(<FormattedDate {...props} />);
  return {
    props,
    output
  };
}

describe('components', () => {
  describe('Date', () => {

    it('formats and renders a string as date with correct prefix', () => {
      const { output } = setup(
        {
          prefix: 'test',
          format: 'MMMM, YYYY',
          date: '01-01-2017'
        }
      );
      expect(output.type).toBe('span');
      expect(output.props.children).toEqual('test January, 2017');
    });

    it('formats and renders a date object with correct prefix', () => {
      const { output } = setup(
        {
          prefix: 'prefix',
          format: 'MMMM, YYYY',
          date: new Date(2017, 0, 1)
        }
      );
      expect(output.type).toBe('span');
      expect(output.props.children).toEqual('prefix January, 2017');
    });

    it('uses a default format if none is specified', () => {
      const { output } = setup(
        {
          prefix: '',
          format: '',
          date: new Date(2017, 0, 1)
        }
      );
      expect(output.type).toBe('span');
      expect(output.props.children).toEqual('January 01, 2017');
    });

    it('returns null when not passed a date', () => {
      const { output } = setup(
        {
          prefix: '',
          format: '',
          date: ''
        }
      );
      expect(output).toBe(null);
    });
  });
});
