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

  # https://github.com/mbleigh/acts-as-taggable-on/issues/91#issuecomment-168273770
  def tag_list
    tags.select(:name)
  end
end
