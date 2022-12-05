# frozen_string_literal: true

module Entitlements
  # @abstract
  class AbstractContract < Dry::Validation::Contract
    import_predicates_as_macros

    register_macro :existing_global_id do
      next unless value.kind_of?(::GlobalID)

      begin
        value.find
      rescue ActiveRecord::RecordNotFound
        key.failure "does not exist"
      end
    end
  end
end
