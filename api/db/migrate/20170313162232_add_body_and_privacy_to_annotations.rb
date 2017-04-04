class AddBodyAndPrivacyToAnnotations < ActiveRecord::Migration[5.0]
  def change
    add_column :annotations, :body, :text
    add_column :annotations, :private, :boolean, default: false
  end
end
