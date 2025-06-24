# frozen_string_literal: true

class AddProcessingFailedToIngestions < ActiveRecord::Migration[7.0]
  def change
    change_table :ingestions do |t|
      t.boolean :processing_failed, null: false, default: false
    end
  end
end
