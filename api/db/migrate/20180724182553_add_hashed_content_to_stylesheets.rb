class AddHashedContentToStylesheets < ActiveRecord::Migration[5.0]
  def up
    add_column :stylesheets, :hashed_content, :string

    execute <<~SQL.squish
      UPDATE stylesheets ss
      SET hashed_content = md5(ss.raw_styles)
    SQL
  end

  def down
    remove_column :stylesheets, :hashed_content, :string
  end
end
