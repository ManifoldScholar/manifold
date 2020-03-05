module Entitlements
  class Summary
    include StoreModel::Model

    attribute :current_state, :string
    attribute :entitlement_id, :string
    attribute :expired, :boolean
    attribute :expired_at, :datetime
    attribute :expires_on, :date
  end
end
