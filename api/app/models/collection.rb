# A collection of resources
class Collection < ApplicationRecord

  # Concerns
  include Authority::Abilities
  include Attachments

  # Associations
  belongs_to :project
  has_many :collection_resources,
           dependent: :destroy
  has_many :resources, through: :collection_resources

  # Attachments
  manifold_has_attached_file :thumbnail, :image

  def resource_kinds
    resources
      .select("resources.kind, collection_resources.position")
      .to_a.pluck(:kind)
      .uniq
  end

  def resource_tags
    resources
      .tag_counts
      .pluck(:name)
  end

  def to_s
    title
  end

end
