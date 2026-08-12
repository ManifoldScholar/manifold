class AddProjectCollectionsToPgSearch < ActiveRecord::Migration[7.2]
  def change
    add_reference :pg_search_documents, :project_collection, foreign_key: { on_delete: :cascade }, null: true, type: :uuid
  end
end
