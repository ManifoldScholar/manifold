class ResourceImportRowTransition < ApplicationRecord

  belongs_to :resource_import_row, inverse_of: :resource_import_row_transitions

  after_destroy :update_most_recent, if: :most_recent?

  private

  def update_most_recent
    last_transition = resource_import_row
      .resource_import_row_transitions
      .order(:sort_key)
      .last
    return unless last_transition.present?

    last_transition.update_column(:most_recent, true)
  end

end
