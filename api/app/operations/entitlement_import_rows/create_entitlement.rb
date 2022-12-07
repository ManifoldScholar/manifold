# frozen_string_literal: true

module EntitlementImportRows
  class CreateEntitlement
    include Dry::Effects.Resolve(:entitler)
    include Dry::Monads[:result, :validated, :do]

    prepend EntitlementImports::WithMessages

    # @param [EntitlementImportRow] row
    # @return [Dry::Monads::Result]
    def call(row)
      return Failure[:invalid_state] unless row.in_state?(:pending)

      yield maybe_set_target! row

      result = build_entitlement_for! row

      Dry::Matcher::ResultMatcher.(result) do |m|
        m.success do
          row.transition_to! :success
        end

        m.failure do
          row.transition_to! :failure
        end
      end

      return result
    end

    private

    def attributes_to_entitle(row)
      attrs = row.slice(:subject, :target, :expires_on)

      attrs[:entitler] = entitler { row.to_upsertable_entitler }

      Success attrs
    end

    def build_entitlement(row)
      attrs = yield attributes_to_entitle row

      entitlement = Entitlement.new(**attrs)

      case entitlement.subject
      when SystemEntitlement
        entitlement.global_roles.subscriber = true
      else
        entitlement.scoped_roles.read_access = true
      end

      Success entitlement
    end

    def build_entitlement_for!(row)
      entitlement = yield build_entitlement row

      if entitlement.save
        row.entitlement = entitlement

        row.save!

        Success entitlement
      else
        entitlement.errors.full_messages.each do |err|
          log! "Problem saving entitlement: #{err}"
        end

        Failure[:invalid]
      end
    end

    def build_pending_entitlement_for!(row)
      pending_entitlement = PendingEntitlement.new(row.to_pending_entitlement_attributes)

      if pending_entitlement.save
        row.pending_entitlement = pending_entitlement

        row.save!

        log! "Created pending entitlement #{pending_entitlement.id}"

        Success pending_entitlement
      else
        pending_entitlement.errors.full_messages.each do |err|
          log! "Problem saving pending entitlement: #{err}"
        end

        Failure[:invalid]
      end
    end

    # @param [EntitlementImportRow] row
    # @return [Dry::Monads:Result]
    def maybe_set_target!(row)
      return Success() if row.target.present? || row.email.blank?

      row.target = User.where(email: row.email).first

      row.save! if row.target_id_changed?

      return Success() unless row.target.blank?

      yield build_pending_entitlement_for!(row)

      row.transition_to! :success

      Failure[:no_target_yet, row.email]
    end
  end
end
