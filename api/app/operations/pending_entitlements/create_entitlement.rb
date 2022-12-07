# frozen_string_literal: true

module PendingEntitlements
  class CreateEntitlement
    include Dry::Effects.Resolve(:entitler)
    include Dry::Monads[:result, :validated, :do]
    include ManifoldApi::Deps[
      find_user: "pending_entitlements.find_user",
    ]

    prepend EntitlementImports::WithMessages

    # @param [PendingEntitlement] pending_entitlement
    # @return [Dry::Monads::Result]
    def call(pending_entitlement)
      return Failure[:invalid_state] unless pending_entitlement.in_state?(:pending)

      yield find_user.(pending_entitlement)

      result = build_entitlement_for! pending_entitlement

      Dry::Matcher::ResultMatcher.(result) do |m|
        m.success do
          pending_entitlement.transition_to! :success
        end

        m.failure do
          pending_entitlement.transition_to! :failure
        end
      end

      return result
    end

    private

    def attributes_to_entitle(pending_entitlement)
      # It's possible some time has passed since a pending entitlement was created
      # and actually granted. In these instances, we want to make sure that we are
      # accounting for relative times set in the pending date.
      pending_entitlement.parse_expiration!

      attrs = pending_entitlement.slice(:subject, :expires_on)

      attrs[:target] = pending_entitlement.user

      attrs[:entitler] = entitler { pending_entitlement.creator.to_upsertable_entitler }

      Success attrs
    end

    def build_entitlement(pending_entitlement)
      attrs = yield attributes_to_entitle pending_entitlement

      entitlement = Entitlement.new(**attrs)

      case entitlement.subject
      when SystemEntitlement
        entitlement.global_roles.subscriber = true
      else
        entitlement.scoped_roles.read_access = true
      end

      Success entitlement
    end

    def build_entitlement_for!(pending_entitlement)
      entitlement = yield build_entitlement pending_entitlement

      if entitlement.save
        pending_entitlement.entitlement = entitlement

        pending_entitlement.save!

        Success entitlement
      else
        entitlement.errors.full_messages.each do |err|
          log! "Problem saving entitlement: #{err}"
        end

        Failure[:invalid]
      end
    end
  end
end
