class AddIgnoreAccessRestrictionsToTexts < ActiveRecord::Migration[5.2]
  def change
    add_column :texts, :ignore_access_restrictions, :boolean, default: false
  end
end
