# Model concern that tracks who created a record
module TruthyChecks
  extend ActiveSupport::Concern

  class_methods do
    def truthy?(value)
      return false if [false, "", nil].include? value
      return true if [true, 1, "1"].include? value
      return true if value.casecmp("true").zero?
      false
    end

    def falsey?(value)
      !truthy?(value)
    end
  end
end
