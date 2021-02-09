module CollectionEntry
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable

  included do
    delegate :collector_definition, :collectable_definition,
             :collectable_project?, :collectable_resource?, :collectable_resource_collection?, :collectable_text?,
             to: :class

    delegate :collectable_associations,
             :collectable_model,
             :collectable_jsonapi_type,
             :collectable_type,
             to: :collectable_definition
  end

  # @!attribute [r] collectable_id
  # @return [String]
  def collectable_id
    read_attribute collectable_associations.collectable.foreign_key
  end

  module ClassMethods
    extend Memoist

    delegate :collectable_associations,
             :collectable_project?, :collectable_resource?, :collectable_resource_collection?, :collectable_text?,
             to: :collectable_definition, allow_nil: true

    delegate :project?, :resource?, :resource_collection?, :text?,
             to: :collectable_definition, allow_nil: true, prefix: :collectable

    delegate :collectable_jsonapi_type, :collectable_type, to: :collectable_associations, allow_nil: true

    # Polymorphic method that knows which actual association to search on
    # @param [Collectable] collectable
    # @return [ActiveRecord::Relation]
    def by_collectable(collectable)
      association_name = collectable_definition.associations.collectable.singular

      where(association_name => collectable)
    end

    # @!attribute [r] collector_definition
    # @return [Collections::Definition]
    memoize def collector_definition
      Collections::Mapping.fetch self
    end

    # @!attribute [r] collectable_definition
    # @return [Collections::CollectableDefinition]
    memoize def collectable_definition
      collector_definition.collectables.fetch self
    end
  end
end
