module Concerns
  module Sluggable
    extend ActiveSupport::Concern

    included do
      include FriendlyId
      validates :slug, presence: true, uniqueness: true, allow_nil: true
      friendly_id :slugable_candidates, use: :slugged
    end

    def slug_candidates
      [:title]
    end

    def slugable_candidates
      return [@pending_slug] if @pending_slug.present?

      slug_candidates
    end

    def pending_slug
      slug
    end

    def pending_slug=(value)
      adjusted = value.blank? ? nil : normalize_friendly_id(value)
      @pending_slug = adjusted
      self.slug = nil
    end
  end
end
