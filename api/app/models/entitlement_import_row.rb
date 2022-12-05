# frozen_string_literal: true

class EntitlementImportRow < ApplicationRecord
  include HasStateMachine

  has_state_machine! initial_state: :pending

  belongs_to :entitlement_import, inverse_of: :entitlement_import_rows, counter_cache: true
  belongs_to :subject, optional: true, polymorphic: true
  belongs_to :target, optional: true, polymorphic: true
  belongs_to :entitlement, optional: true

  scope :in_order, -> { order(line_number: :asc) }

  scope :pending_for_email, ->(email) do
    where(email: email, target: nil).in_state(:pending)
  end
end
