# rubocop:disable Metrics/BlockLength
Rails.application.configure do
  if ActiveRecord::Base.connection.data_source_exists? "settings"
    config.after_initialize do
      settings = Settings.instance
      email = settings.email

      if settings.email[:delivery_method] == "smtp"
        config.action_mailer.delivery_method = :smtp
        config.action_mailer.smtp_settings = {
          address: email[:smtp_settings_address],
          port: email[:smtp_settings_port],
          user_name: email[:smtp_settings_user_name],
          password: settings.secrets[:smtp_settings_password]
        }
      end

      if settings.email[:delivery_method] == "sendmail"
        config.action_mailer.delivery_method = :sendmail
        config.action_mailer.sendmail_settings = {
          location: email[:sendmail_settings_location],
          arguments: email[:sendmail_settings_arguments]
        }
      end

      from_name = email[:from_name] || "Manifold Scholarship"
      from_address = email[:from_address] || "do-not-reply@manifoldapp.org"
      reply_name = email[:reply_to_name] || "Manifold Scholarship"
      reply_address = email[:reply_to_address] || "do-not-reply@manifoldapp.org"

      from = "#{from_name} <#{from_address}>"
      reply_to = "#{reply_name} <#{reply_address}>"

      config.action_mailer.default_options = {
        from: from,
        reply_to: reply_to
      }
    end
  end
end
# rubocop:enable Metrics/BlockLength
