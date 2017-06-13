class AddIngestedToStylesheets < ActiveRecord::Migration[5.0]
  def change
    add_column :stylesheets, :ingested, :boolean, default: false
  end
end
