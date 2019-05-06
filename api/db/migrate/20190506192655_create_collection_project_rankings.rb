class CreateCollectionProjectRankings < ActiveRecord::Migration[5.1]
  def change
    create_view :collection_project_rankings
  end
end
