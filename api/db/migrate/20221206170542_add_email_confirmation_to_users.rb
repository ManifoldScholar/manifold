# frozen_string_literal: true

class AddEmailConfirmationToUsers < ActiveRecord::Migration[6.0]
  def change
    change_table :users do |t|
      t.text :email_confirmation_token
      t.timestamp :email_confirmation_sent_at, null: true, precision: 6
      t.timestamp :email_confirmed_at, null: true, precision: 6

      t.index :email_confirmed_at
    end
  end
end
