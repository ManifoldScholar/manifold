class ActionCallout < ApplicationRecord

  # Authorization
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Attachments

  # Ordering
  acts_as_list scope: [:calloutable_id, :location, :button]

  # Relationships
  belongs_to :calloutable, polymorphic: true
  belongs_to :text, optional: true

  # Validations
  validates :title, :kind, :location, presence: true
  validates :text, presence: true, if: :requires_text?
  validates :url, presence: true, if: :requires_url?
  validates :visibility, presence: true, if: :requires_visibility?

  enum kind: {
    link: 0,
    read: 1,
    toc: 2,
    download: 3
  }

  enum visibility: {
    always: 0,
    authorized: 1,
    unauthorized: 2
  }

  enum location: {
    left: 0,
    right: 1
  }

  manifold_has_attached_file :attachment,
                             :resource,
                             no_styles: true,
                             validate_content_type: false

  def project
    calloutable if calloutable.is_a? Project
  end

  def journal
    calloutable if calloutable.is_a? Journal
  end

  private

  def requires_url?
    link?
  end

  def requires_visibility?
    link? || download?
  end

  def requires_text?
    read? || toc?
  end

end
