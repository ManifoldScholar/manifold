# frozen_string_literal: true

class EntitlementImportRow < ApplicationRecord
  include HasStateMachine

  has_state_machine! initial_state: :pending

  belongs_to :entitlement_import, inverse_of: :entitlement_import_rows, counter_cache: true
  belongs_to :subject, optional: true, polymorphic: true
  belongs_to :target, optional: true, polymorphic: true
  belongs_to :entitlement, optional: true
  belongs_to :pending_entitlement, optional: true, inverse_of: :entitlement_import_row

  scope :in_order, -> { order(line_number: :asc) }

  delegate :creator, :to_upsertable_entitler, to: :entitlement_import

  def has_immediate_entitlement?
    target.present? && entitlement.present?
  end

  def has_pending_entitlement?
    pending_entitlement.present?
  end

  def ready_to_succeed?
    return false unless subject.present?

    subject.present? && (has_immediate_entitlement? || has_pending_entitlement?)
  end

  def to_pending_entitlement_attributes
    slice(:creator, :email, :subject, :first_name, :last_name).merge(expiration: expiration.presence || expires_on.presence&.to_s)
  end
end
