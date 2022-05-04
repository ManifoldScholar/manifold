module Collections
  class CollectableDefinition
    extend Dry::Initializer
    extend Memoist

    include Dry::Equalizer.new(:collectable)
    include MultiKeyable

    multi_keyable :collectable, :entry

    param :collectable, Types::ModelProxy

    option :parent, Collections::Definition::Type, as: :type

    option :entry_name, Types::String, default: proc { "#{type.entry_prefix}#{collectable.name}" }

    option :entry, Types::ModelProxy, default: proc { entry_name }

    delegate :model_name, to: :collectable, prefix: true
    delegate :model_name, to: :entry, prefix: true
    delegate :collector, :entry_prefix, :grouping, :has_grouping?, to: :type

    attr_reader :collectable_associations

    alias associations collectable_associations

    delegate :collectable_jsonapi_type, :collectable_type, to: :associations

    def initialize(*)
      super

      @collectable_associations = CollectableAssociations.new self
    end

    # @param [Collector] collector
    # @return [ActiveRecord::Relation<CollectionEntry>]
    def entry_collection_scope_for(collector)
      collector.public_send(associations.entry.collection)
    end

    # @return [Class]
    def entry_model
      entry_name.constantize
    end

    def project?
      collectable_model_name == "Project"
    end

    def resource?
      collectable_model_name == "Resource"
    end

    def resource_collection?
      collection_model_name == "ResourceCollection"
    end

    def text?
      collection_model_name == "Text"
    end
  end
end
