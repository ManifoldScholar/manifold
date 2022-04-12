module Utilities
  class Truthy
    def self.truthy?(value)
      compare = value.respond_to?(:strip) ? value.strip : value
      return false if [false, "", nil].include? compare
      return true if [true, 1, "1"].include? compare
      return true if value.respond_to?(:casecmp) && value.casecmp("true").zero?

      false
    end

    def self.to_boolean(value)
      return true if truthy?(value)

      false
    end

    def self.falsey?(value)
      !truthy?(value)
    end
  end
end
