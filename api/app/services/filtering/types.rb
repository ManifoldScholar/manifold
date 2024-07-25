# frozen_string_literal: true

module Filtering
  module Types
    include Dry.Types

    ModelKlass = Class.constrained(lt: ::Filterable)

    Params = Coercible::Hash.map(Coercible::String, Any).constructor do |value|
      case value
      when ActionController::Parameters
        value.to_unsafe_h
      when Interface(:to_hash)
        value.to_hash
      else
        value.to_h
      end
    end.fallback { {} }

    Scope = Instance(::ActiveRecord::Relation)

    SortDirection = Dry::Types["coercible.string"].default("asc").enum("asc", "desc").fallback("asc")

    User = Instance(::AnonymousUser) | Instance(::User)
  end
end
