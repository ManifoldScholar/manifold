class AddImageCreditsToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :image_credits, :text
  end
end
