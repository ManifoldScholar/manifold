# frozen_string_literal: true

module Filtering
  module Types
    include Dry.Types

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

    User = Instance(::AnonymousUser) | Instance(::User)
  end
end
