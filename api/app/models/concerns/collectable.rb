# rubocop:disable Metrics/AbcSize
module Collectable
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable

  included do
    has_many reading_group_collectable_associations.entry.collection,
             inverse_of: reading_group_collectable_associations.collectable.singular,
             dependent: :destroy

    define_collectable_associations!
  end

  # @param [User] user
  def collected_by?(user)
    return false unless user.present?

    catch(:found) do
      throw :found, true if collected_by_user?(user)

      throw :found, true if collected_by_reading_group?(user)

      false
    end
  end

  def collected_by_user?(user)
    return false unless respond_to?(:collecting_users)

    user.in? collecting_users
  end

  def collected_by_reading_group?(user)
    return false unless respond_to?(:collecting_moderators)

    user.in? collecting_moderators
  end

  module ClassMethods
    extend Memoist

    memoize def reading_group_definition
      Collections::Mapping[ReadingGroup]
    end

    memoize def reading_group_collectable_definition
      Collections::Mapping[ReadingGroup][self]
    end

    memoize def reading_group_collectable_associations
      reading_group_collectable_definition.associations
    end

    # @return [Class]
    memoize def reading_group_entry_model
      reading_group_collectable_definition.entry_model
    end

    memoize def user_collected_definition
      Collections::Mapping[User]
    end

    memoize def user_collected_collectable_definition
      Collections::Mapping[User][self]
    end

    memoize def user_collectable_associations
      user_collected_collectable_definition.associations
    end

    memoize def user_collected_entry_model
      user_collected_collectable_definition.entry_model
    end

    private

    # @return [void]
    def define_collectable_associations!
      Collections::Mapping.each do |collector|
        collectable_definition = collector[self]

        next unless collectable_definition

        associations = collectable_definition.associations

        has_many associations.entry.collection, inverse_of: associations.collectable.singular, dependent: :destroy

        has_many associations.collecting_collectors, through: associations.entry.collection, source: associations.collector.singular

        if collector.collector.model_name == "ReadingGroup"
          has_many :collecting_moderators, -> { distinct }, through: associations.collecting_collectors, source: :moderators
          has_many :collecting_reading_group_users, -> { distinct }, through: associations.collecting_collectors, source: :users
        end
      end
    end
  end
end
# rubocop:enable Metrics/AbcSize
