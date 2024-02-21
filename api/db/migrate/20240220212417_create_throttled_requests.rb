# frozen_string_literal: true

class CreateThrottledRequests < ActiveRecord::Migration[6.1]
  def change
    create_table :throttled_requests, id: :uuid do |t|
      t.inet :ip
      t.citext :email
      t.text :matched
      t.text :match_type
      t.text :path

      t.bigint :occurrences, null: false, default: 0

      t.timestamp :last_occurred_at

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index :ip
      t.index :email

      t.index %i[ip email matched match_type path], name: "index_throttled_requests_uniqueness", unique: true
    end
  end
end
