class RemoveSubjectSlugFromEvents < ActiveRecord::Migration[5.0]
  def change
    remove_column :events, :subject_slug, :string
    remove_column :events, :project_slug, :string
  end
end
