class AddPurposeToPages < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :purpose, :string, default: "supplemental_content"
  end
end
