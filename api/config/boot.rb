ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.

lib_dir = File.expand_path("../lib", __dir__)

$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)
