# Load DSL and set up stages
require 'capistrano/setup'
require 'capistrano/deploy'
require 'capistrano/touch-linked-files'
require 'capistrano/rbenv'
require 'capistrano/bundler'
require 'capistrano/npm'
require 'capistrano/copy_files'

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
