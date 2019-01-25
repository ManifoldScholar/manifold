class CreateCallToActions < ActiveRecord::Migration[5.0]
  def change
    create_table :call_to_actions, id: :uuid do |t|
      t.string :title
      t.integer :kind, default: 0, null: false
      t.integer :location, default: 0, null: false
      t.string :url
      t.jsonb :attachment_data, default: {}

      t.integer :position, default: 1, null: false
      t.belongs_to :project, type: :uuid
      t.belongs_to :text, type: :uuid
      t.timestamps
    end
  end
end
