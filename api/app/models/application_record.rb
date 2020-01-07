# Base class for Manifold models to inherit from
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  INHERITS = Dux.inherits(self).freeze

  include ClassyEnum::ActiveRecord
  include Concerns::ArelHelpers
  include Concerns::SliceWith
  include WithAdvisoryLock::Concern

  # https://api.rubyonrails.org/classes/ActiveModel/Errors.html#method-i-merge-21
  # This exists in Rails 5.2, so we can remove this whenever we upgrade to 5.2
  def merge_errors!(other)
    errors.messages.merge!(other.messages) { |_, ary1, ary2| ary1 + ary2 }
    errors.details.merge!(other.details) { |_, ary1, ary2| ary1 + ary2 }
  end

  class << self
    def in_the_week_of(date)
      where(created_at: date.to_week_range)
    end
  end
end
