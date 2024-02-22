# frozen_string_literal: true

# @abstract Base class for Manifold models to inherit from
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  INHERITS = Dux.inherits(self).freeze

  include ClassyEnum::ActiveRecord
  include ArelHelpers
  include DetectsSpam
  include SliceWith
  include ValuesAt
  include WithAdvisoryLock::Concern

  # Quote the model's primary key if it is persisted and a single string.
  #
  # @return [String, nil]
  def quoted_id
    self.class.connection.quote id if persisted? && id.kind_of?(String)
  end

  def merge_errors!(other)
    errors.merge!(other)
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
