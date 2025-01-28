# Tracks the relationship between texts and makers
class Collaborator < ApplicationRecord
  acts_as_list scope: [:collaboratable_id, :collaboratable_type]

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Filterable

  self.authorizer_name = "ProjectChildAuthorizer"

  # Associations
  belongs_to :collaboratable, polymorphic: true
  belongs_to :maker

  classy_enum_attr :role, class_name: "CollaboratorRole", default: CollaboratorRole::Other

  before_update :set_role_priority

  scope :by_role, ->(role = nil) { where(role: role) if role.present? }
  scope :by_maker, ->(maker = nil) { where(maker: maker) if maker.present? }

  delegate :name, to: :maker, prefix: true

  def packaging_metadata
    maker.packaging_metadata.merge(slice(:role))
  end

  def to_s
    "#{role} #{maker}"
  end

  def set_role_priority
    self.priority = role.priority
  end
end
