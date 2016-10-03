import { server } from 'universal-webpack';
import settings from '../../webpack/web-server-webpack-settings';
import configuration from '../../webpack/webpack.config';
server(configuration, settings);
