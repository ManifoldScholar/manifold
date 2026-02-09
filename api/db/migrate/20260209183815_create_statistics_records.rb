# frozen_string_literal: true

class CreateStatisticsRecords < ActiveRecord::Migration[7.0]
  def change
    create_table :statistics_records, id: :uuid do |t|
      t.string :key, null: false
      t.float :value, default: 0.0

      t.timestamps

      t.index :key, unique: true
    end
  end
end
