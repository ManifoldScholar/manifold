import { PropTypes } from 'react';

export default {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dirtyModel: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func
};
