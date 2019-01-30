class CreateActionCallouts < ActiveRecord::Migration[5.0]
  def change
    create_table :action_callouts, id: :uuid do |t|
      t.string :title
      t.string :url
      t.integer :kind, default: 0, null: false
      t.integer :location, default: 0, null: false
      t.jsonb :attachment_data, default: {}
      t.boolean :button, default: false
      t.integer :position, default: 1, null: false
      t.belongs_to :project, type: :uuid
      t.belongs_to :text, type: :uuid
      t.timestamps
    end
  end
end
