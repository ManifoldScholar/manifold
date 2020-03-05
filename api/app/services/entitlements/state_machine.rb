module Entitlements
  class StateMachine
    include Statesman::Machine
    include Statesman::Events

    state :pending, initial: true
    state :expiring_soon
    state :expired
    state :active

    transition from: :pending, to: %i[expiring_soon expired active]
    transition from: :expiring_soon, to: %i[active expired]
    transition from: :expired, to: %i[active expiring_soon]
    transition from: :active, to: %i[expiring_soon expired]

    after_transition to: :expired do |entitlement, _transition|
      entitlement.touch :expired_at
    end

    after_transition from: :expired do |entitlement, _transition|
      entitlement.update_column :expired_at, nil
    end
  end
end
