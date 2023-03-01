# Base class for Manifold models to inherit from
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  INHERITS = Dux.inherits(self).freeze

  include ClassyEnum::ActiveRecord
  include ArelHelpers
  include SliceWith
  include ValuesAt
  include WithAdvisoryLock::Concern

  # Quote the model's primary key if it is persisted and a single string.
  #
  # @return [String, nil]
  def quoted_id
    self.class.connection.quote id if persisted? && id.kind_of?(String)
  end

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

    def sample(num = nil)
      randomized = reorder(Arel.sql("RANDOM()"))

      if num.is_a?(Integer) && num >= 1
        randomized.limit(num)
      else
        randomized.first
      end
    end
  end
end
