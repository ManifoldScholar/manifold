# Base class for Manifold models to inherit from
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  class << self
    def in_the_week_of(date)
      where(created_at: date.to_week_range)
    end
  end
end
