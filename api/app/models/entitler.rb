# A semantic wrapper around an `entity` who can entitle a {User}
# with any number of given roles.
class Entitler < ApplicationRecord
  ACCEPTED_ENTITY_TYPES = %w[User].freeze

  upsert_keys %i[entity_id entity_type]

  belongs_to :entity, polymorphic: true

  has_many :entitlements, inverse_of: :entitler, dependent: :destroy

  before_validation :set_name!, on: :create

  validates :name, presence: true
  validates :entity_id, uniqueness: { scope: :entity_type, on: :update }
  validates :entity_type, inclusion: { in: ACCEPTED_ENTITY_TYPES }

  private

  # @return [void]
  def set_name!
    self.name = entity.name unless name.present?
  end
end
