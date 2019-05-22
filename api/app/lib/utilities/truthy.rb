module Utilities
  class Truthy
    def self.truthy?(value)
      return false if [false, "", nil].include? value
      return true if [true, 1, "1"].include? value
      return true if value.casecmp("true").zero?

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
