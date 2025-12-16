# frozen_string_literal: true

require "bundler/setup" # Set up gems listed in the Gemfile.
require "logger" # Fix concurrent-ruby removing logger dependency which Rails itself does not have

ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

lib_dir = File.expand_path("../lib", __dir__)

$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)
