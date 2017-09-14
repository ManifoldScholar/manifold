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

  has_formatted_attributes :header, :subheader, :body, include_wrap: false

  acts_as_list

  default_scope { order(position: :asc) }

  def to_s
    header
  end

end
