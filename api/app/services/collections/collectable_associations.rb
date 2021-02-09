module Collections
  class CollectableAssociations
    extend Memoist

    WRAPPER = Types.Constructor(Collections::AssociationWrapper) do |model|
      case model
      when nil then nil
      when Types::ModelProxy then Collections::AssociationWrapper.new(model)
      when Collections::AssociationWrapper then model
      end
    end

    include Dry::Initializer.define -> do
      param :definition, Types.Instance(Collections::CollectableDefinition)

      option :collector_model, Types::ModelProxy, default: proc { definition.collector }
      option :collectable_model, Types::ModelProxy, default: proc { definition.collectable }
      option :entry_model, Types::ModelProxy, default: proc { definition.entry }
      option :grouping_model, Types::ModelProxy.optional, optional: true, default: proc { definition.grouping }

      option :collectable_model_name, Types.Instance(ActiveModel::Name), default: proc { collectable_model.model_name }
      option :entry_model_name, Types.Instance(ActiveModel::Name), default: proc { entry_model.model_name }

      option :collectables, Types::Symbol, default: proc { collectable_model_name.collection.to_sym }
      option :entries, Types::Symbol, default: proc { entry_model_name.collection.to_sym }

      option :collector, WRAPPER, default: proc { collector_model }
      option :collectable, WRAPPER, default: proc { collectable_model }
      option :entry, WRAPPER, default: proc { entry_model }
      option :grouping, WRAPPER, optional: true, default: proc { grouping_model }

      option :uncategorized_entries, Types::Symbol, default: proc { :"uncategorized_#{entries}" }
      option :uncategorized_collectables, Types::Symbol, default: proc { :"uncategorized_#{collectables}" }

      option :collecting_collectors, Types::Symbol, default: proc { :"collecting_#{collector.collection}" }
    end

    delegate :jsonapi_type, :type, to: :collectable, prefix: true
  end
end
