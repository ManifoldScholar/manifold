# frozen_string_literal: true

# Model concern that helps with truthy checks
module TruthyChecks
  extend ActiveSupport::Concern

  class_methods do
    def truthy?(value)
      return false if [false, "", nil].include? value
      return true if [true, 1, "1"].include? value
      return true if value.casecmp("true").zero?

      false
    end

    def to_boolean(value)
      return true if truthy?(value)

      false
    end

    def falsey?(value)
      !truthy?(value)
    end
  end
end
