# Model representing a home page feature
class Feature < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Concerns
  include TrackedCreator
  include Concerns::HasFormattedAttributes
  include Attachments

  manifold_has_attached_file :background, :image
  manifold_has_attached_file :foreground, :image

  has_formatted_attributes :header, :subheader, include_wrap: false
  has_formatted_attribute :body

  acts_as_list

  default_scope { order(position: :asc) }

  def to_s
    header
  end

end
