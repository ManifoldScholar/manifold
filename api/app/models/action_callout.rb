class ActionCallout < ApplicationRecord

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include Attachments

  # Ordering
  acts_as_list scope: [:project_id, :location, :button]

  # Relationships
  belongs_to :project
  belongs_to :text, optional: true

  # Validations
  validates :title, :kind, :location, presence: true
  validates :text, presence: true, if: :requires_text?
  validates :url, presence: true, if: :requires_url?

  enum kind: {
    link: 0,
    read: 1,
    toc: 2,
    download: 3
  }

  enum location: {
    left: 0,
    right: 1
  }

  manifold_has_attached_file :attachment,
                             :resource,
                             no_styles: true,
                             validate_content_type: false

  private

  def requires_url?
    link?
  end

  def requires_text?
    read? || toc?
  end

end
