# frozen_string_literal: true

class AddLtiToSettings < ActiveRecord::Migration[7.0]
  def change
    change_table :settings do |t|
      t.jsonb :lti, null: false, default: {}
    end
  end
end
