class AddCreatorToStylesheets < ActiveRecord::Migration[5.0]
  def change
    add_column :stylesheets, :creator_id, :uuid, foreign_key: true
    cli_user = User.where(is_cli_user: true).first
    Stylesheet.all.each.with_index(1) do |stylesheet, index|
      stylesheet.update_column :creator_id, cli_user.id
    end
  end
end
