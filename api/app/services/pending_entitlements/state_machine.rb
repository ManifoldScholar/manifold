# frozen_string_literal: true

module PendingEntitlements
  # @see PendingEntitlement
  # @see PendingEntitlementState
  class StateMachine
    include Statesman::Machine

    state :pending, initial: true
    state :success
    state :failure

    transition from: :pending, to: %i[success failure]

    guard_transition to: :success do |pe|
      pe.ready_to_succeed?
    end

    after_transition to: :success do |pe|
      EntitlementMailer.created(pe.user, pe.entitlement).deliver_later
    end
  end
end
