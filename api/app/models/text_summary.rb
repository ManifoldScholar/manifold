class TextSummary < ApplicationRecord
  include Attachments
  include View

  self.primary_key = :id

  belongs_to :project
  belongs_to :text
  belongs_to :category

  scope :by_category, ->(category) { where(category: category) if category.present? }
  scope :uncategorized, -> { where(category: nil) }

  manifold_has_attached_file :cover, :image

  serialize :toc, Array

  delegate :collected_by?, to: :text

  alias_attribute :toc_section_id, :toc_section

  def readonly?
    true
  end

  def age
    (Time.zone.today - created_at.to_date).to_i
  end
end
