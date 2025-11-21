class AddExternalIdentifiersTable < ActiveRecord::Migration[7.0]
  def change
    create_table :external_identifiers, id: :uuid do |t|
      t.string :identifier, null: false
      t.references :identifiable, polymorphic: true
      t.timestamps
    end
  end
end
