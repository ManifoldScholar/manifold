class AddHashTagToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :hashtag, :string
  end
end
