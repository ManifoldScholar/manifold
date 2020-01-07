class ProjectExportationTransition < ApplicationRecord
  belongs_to :project_exportation, inverse_of: :transitions

  after_destroy :update_most_recent, if: :most_recent?

  private

  def update_most_recent
    # :nocov:
    last_transition = project_exportation.transitions.order(:sort_key).last

    return unless last_transition.present?

    last_transition.update_column(:most_recent, true)
    # :nocov:
  end
end
