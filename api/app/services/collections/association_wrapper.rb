module Collections
  class AssociationWrapper
    extend Memoist

    include Dry::Initializer.define -> do
      param :model, Types::ModelProxy

      option :model_name, Types.Instance(ActiveModel::Name), default: proc { model.model_name }

      option :foreign_key, Types::Symbol, default: proc { :"#{model_name.singular}_id" }

      # Used for JSONAPI serialization
      option :jsonapi_type, Types::String, default: proc { model_name.collection }

      # Used for polymorphic types
      option :type, Types::String, default: proc { model_name.name }

      option :collection, Types::Coercible::Symbol, default: proc { model_name.collection }

      option :singular, Types::Coercible::Symbol, default: proc { model_name.singular }

      option :uncategorized_collection, Types::Symbol, default: proc { :"uncategorized_#{collection}" }
    end
  end
end
