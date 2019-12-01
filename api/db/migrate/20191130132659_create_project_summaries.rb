class CreateProjectSummaries < ActiveRecord::Migration[5.2]
  def change
    create_view :project_summaries
  end
end
