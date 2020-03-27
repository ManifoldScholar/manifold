module Entitlements
  # For use in relationships controllers, where the subject has already been defined
  # on a non-persisted {Entitlement}.
  class ScopedCreate < AbstractCreate
    record :entitlement

    validate :entitlement_is_new_record!

    def execute
      assign_attributes_to @entitlement

      persist_model! entitlement, assimilate: true
    end

    private

    # @return [void]
    def entitlement_is_new_record!
      errors.add :base, "Must be called on a new entitlement" if entitlement.persisted?
    end
  end
end
