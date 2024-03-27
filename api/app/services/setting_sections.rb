# frozen_string_literal: true

# Namespace for segmented sections for the {Settings} model.
#
# @see SettingSections::Base
module SettingSections
  extend Dry::Core::Container::Mixin

  # The various names of the sections.
  #
  # Each corresponds to a class under this module.
  NAMES = [
    :email,
    :general,
    :ingestion,
    :integrations,
    :rate_limiting,
    :secrets,
    :theme,
  ].freeze

  register "classes", memoize: true do
    NAMES.index_with do |name|
      "setting_sections/#{name}".camelize(:upper).constantize
    end
  end

  register "matcher", memoize: true do
    NAMES | NAMES.map(&:to_s)
  end

  register "strong_params", memoize: true do
    resolve(:classes).transform_values(&:strong_params)
  end

  class << self
    # @param [String, Symbol] section
    def valid?(section)
      section.in?(self[:matcher])
    end
  end
end
