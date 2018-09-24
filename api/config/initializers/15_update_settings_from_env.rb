Rails.application.configure do
  config.after_initialize do
    begin
      Settings.potentially_update_from_environment!
    rescue NoMethodError
      Rails.logger.warn <<~TEXT
        Unable to update settings from environment due to NoMethodError. This could be due
        to migrations needing to run on the settings object itself. In this case, we allow
        the settings update from environment to fail gracefully. If this error persists
        or occurs outside of migrations, it should be investigated.
      TEXT
    end
  end
end
