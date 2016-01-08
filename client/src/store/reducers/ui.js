import { combineReducers } from 'redux';
import filters from './ui/filters';
import colors from './ui/colors';
import typography from './ui/typography';
import visibility from './ui/visibility';

export default combineReducers({ filters, colors, typography, visibility });
