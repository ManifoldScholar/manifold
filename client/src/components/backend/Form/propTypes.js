import { PropTypes } from 'react';

export default {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dirtyModel: PropTypes.object,
  actions: PropTypes.shape({
    set: PropTypes.func.isRequired
  }),
  value: PropTypes.any,
  onChange: PropTypes.func
};
