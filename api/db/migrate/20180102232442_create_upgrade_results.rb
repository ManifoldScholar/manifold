class CreateUpgradeResults < ActiveRecord::Migration[5.0]
  def change
    create_table :upgrade_results, id: false do |t|
      t.string :version, null: false, primary_key: true
      t.text :output, null: false, default: ""
      t.timestamps
    end
  end
end
