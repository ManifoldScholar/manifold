# Tracks the relationship between texts and makers
class Collaborator < ApplicationRecord
  ROLE_CREATOR = "creator".freeze
  ROLE_CONTRIBUTOR = "contributor".freeze

  acts_as_list scope: [:collaboratable_id, :collaboratable_type]

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Associations
  belongs_to :collaboratable, polymorphic: true
  belongs_to :maker

  scope :by_role, ->(role = nil) { where(role: role) if role.present? }

  delegate :name, to: :maker, prefix: true

  def packaging_metadata
    maker.packaging_metadata.merge(slice(:role))
  end

  def to_s
    "#{role} #{maker}"
  end
end
