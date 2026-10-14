# frozen_string_literal: true

class TextExportTransition < ApplicationRecord
  belongs_to :text_export, inverse_of: :transitions

  after_destroy :update_most_recent, if: :most_recent?

  private

  def update_most_recent
    # :nocov:
    last_transition = text_export.transitions.order(:sort_key).last

    return unless last_transition.present?

    last_transition.update_column(:most_recent, true)
    # :nocov:
  end
end
