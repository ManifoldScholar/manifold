module DynamicMailer
  class Configuration

    def initialize(settings)
      @settings = settings
    end

    def use_sendmail?
      @settings.email[:delivery_method] == "sendmail"
    end

    def use_smtp?
      @settings.email[:delivery_method] == "smtp"
    end

    def from
      from_name = email_config(:from_name, "Manifold Scholarship")
      from_address = email_config(:from_address, "do-not-reply@manifoldapp.org")
      "#{from_name} <#{from_address}>"
    end

    def reply_to
      reply_name = email_config(:reply_to_name, "Manifold Scholarship")
      reply_address = email_config(:reply_to_address, "do-not-reply@manifoldapp.org")
      "#{reply_name} <#{reply_address}>"
    end

    def sendmail_config
      {
        location: email_config(:sendmail_settings_location, "/usr/sbin/sendmail"),
        arguments: email_config(:sendmail_settings_arguments, "-i")
      }
    end

    def smtp_config
      {
        address: email_config(:smtp_settings_address),
        port: email_config(:smtp_settings_port, 25),
        domain: email_config(:smtp_settings_domain, "localhost.localdomain"),
        user_name: email_config(:smtp_settings_user_name),
        password: secrets_config(:smtp_settings_password),
        authentication: email_config(:smtp_settings_authentication),
        enable_starttls: email_config(:smtp_settings_enable_starttls),
        enable_starttls_auto: email_config(:smtp_settings_enable_starttls_auto, true),
        openssl_verify_mode: email_config(:smtp_settings_openssl_verify_mode),
        ssl: email_config(:smtp_settings_ssl),
        tls: email_config(:smtp_settings_tls),
        open_timeout: email_config(:smtp_settings_open_timeout),
        read_timeout: email_config(:smtp_settings_read_timeout)
      }
    end

    def test_config
      {}
    end

    private

    def secrets_config(key)
      @settings.secrets[key]
    end

    def email_config(key, default = nil)
      value = @settings.email[key]
      return default if value.blank?

      value
    end

  end
end
