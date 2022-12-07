# frozen_string_literal: true

module EntitlementImportRows
  class StateMachine
    include Statesman::Machine

    state :pending, initial: true
    state :success
    state :failure

    transition from: :pending, to: %i[success failure]

    guard_transition to: :success do |row|
      row.ready_to_succeed?
    end

    after_transition to: :success do |row|
      case row.target
      when ::User
        EntitlementMailer.created(row.target, row.entitlement).deliver_later
      end
    end
  end
end
