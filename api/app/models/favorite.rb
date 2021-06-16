# This model exists for legacy reasons, and is simply a view that remaps fields from {UserCollectedCompositeEntry},
# and also will infer a {Project} based on its `#favoritable` model.
class Favorite < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor
  include View

  self.primary_key = :id

  belongs_to :user
  belongs_to :favoritable, polymorphic: true

  belongs_to :project, optional: true

  has_many :subjects, through: :project

  # This makes the favorite authorizer a bit simpler.
  alias_attribute :creator, :user

  # @return [UserCollectedEntry]
  def user_collected_entry
    entry_klass = collectable_definition.entry.klass

    collectable_foreign_key = collectable_definition.associations.collectable.foreign_key

    entry_klass.where(user: user, collectable_foreign_key => favoritable_id).first!
  end

  def to_s
    "favorite #{id}"
  end

  # @return [<String>]
  def favorite_subject_ids
    subjects.loaded? ? subjects.map(&:id) : subject_ids
  end

  def collectable_definition
    @collectable_definition ||= Collections::Mapping[User][favoritable_type]
  end
end
