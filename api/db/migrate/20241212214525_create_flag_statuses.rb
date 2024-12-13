class CreateFlagStatuses < ActiveRecord::Migration[6.1]
  def change
    create_view :flag_statuses
  end
end
