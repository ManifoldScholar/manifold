module Concerns
  module Sluggable
    extend ActiveSupport::Concern

    included do
      include FriendlyId
      validates :slug, presence: true, uniqueness: true, allow_nil: true
      friendly_id :slug_candidates, use: :slugged
    end

    def slug_candidates
      [:title]
    end

    def slug=(value)
      adjusted = value.blank? ? nil : normalize_friendly_id(value)
      super(adjusted)
    end
  end
end
