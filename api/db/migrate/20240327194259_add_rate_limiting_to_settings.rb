# frozen_string_literal: true

class AddRateLimitingToSettings < ActiveRecord::Migration[6.1]
  def change
    change_table :settings do |t|
      t.jsonb :rate_limiting, null: false, default: {}
    end
  end
end
