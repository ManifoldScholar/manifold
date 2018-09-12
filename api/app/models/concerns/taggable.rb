module Concerns
  module Taggable
    extend ActiveSupport::Concern

    included do
      acts_as_ordered_taggable

      scope :by_tag, lambda { |tag, any = false|
        next all if tag.blank?
        subquery = unscoped.tagged_with(tag, any: any).unscope(:select)
        where(id: subquery.select(:id))
      }
    end
  end
end
