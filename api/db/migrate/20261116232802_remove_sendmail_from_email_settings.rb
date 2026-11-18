# frozen_string_literal: true

class RemoveSendmailFromEmailSettings < ActiveRecord::Migration[7.0]
  def up
    execute(<<~SQL.squish)
      UPDATE settings
      SET email = jsonb_set(
        COALESCE(email, '{}'::jsonb) - 'sendmail_settings_location' - 'sendmail_settings_arguments',
        '{delivery_method}',
        '"smtp"'
      )
      WHERE COALESCE(email, '{}'::jsonb) ->> 'delivery_method' IS DISTINCT FROM 'smtp'
    SQL

    change_column_null :settings, :email, false
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
