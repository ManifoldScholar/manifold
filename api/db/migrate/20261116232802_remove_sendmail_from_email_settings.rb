# frozen_string_literal: true

class RemoveSendmailFromEmailSettings < ActiveRecord::Migration[7.0]
  def up
    execute(<<~SQL.squish)
      UPDATE settings
      SET email = jsonb_set(
        email - 'sendmail_settings_location' - 'sendmail_settings_arguments',
        '{delivery_method}',
        '"smtp"'
      )
      WHERE email ->> 'delivery_method' = 'sendmail'
    SQL
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
