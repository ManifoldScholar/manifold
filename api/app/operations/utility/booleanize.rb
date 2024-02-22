# frozen_string_literal: true

module Utility
  # Accept a stringish or numeric value and transform it into a boolean,
  # relying on ActiveRecord's logic for handling params.
  class Booleanize
    TYPE = ActiveRecord::Type::Boolean.new

    # @param [Boolean, Object] value
    # @return [Boolean]
    def call(value)
      case value
      when true then true
      when false, nil, /\Ano?\z/i, "" then false
      else
        TYPE.cast(value)
      end
    end

    # Pull a variable out of the environment (that may be missing)
    # and parse it using {#call}.
    #
    # @param [String] key
    # @return [Boolean]
    def env(key)
      call(ENV[key])
    end
  end
end
