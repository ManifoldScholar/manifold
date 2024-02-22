# frozen_string_literal: true

module SettingSections
  module Types
    include Dry.Types

    Section = Coercible::String.enum(*SettingSections::NAMES.map(&:to_s))
  end
end
