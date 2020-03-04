class Role < ApplicationRecord
  include Concerns::SerializedAbilitiesFor

  scopify

  classy_enum_attr :name, enum: "RoleName", allow_blank: false
  classy_enum_attr :kind, enum: "RoleKind", allow_blank: false, default: :unknown

  scope :by_name, ->(name) { where(name: name) }
  scope :by_kind, ->(kind) { where(kind: kind) }
  scope :scoped, -> { by_kind(:scoped) }

  belongs_to :resource, polymorphic: true, optional: true

  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :users, join_table: "users_roles"
  # rubocop:enable Rails/HasAndBelongsToMany

  validates :resource_type, inclusion: { in: Rolify.resource_types }, allow_nil: true

  before_validation :set_kind!

  delegate *RoleKind.predicates, to: :kind

  private

  # @return [void]
  def set_kind!
    self.kind = name.kind_of?(RoleName) ? name.kind : RoleKind[:unknown]
  end
end
