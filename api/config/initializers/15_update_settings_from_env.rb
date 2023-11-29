Rails.application.configure do
  config.after_initialize do
    Settings.potentially_update_from_environment!

    Settings.instance.refresh_formatted_attributes_cache! if Settings.table_exists?
  rescue NoMethodError
    Rails.logger.warn <<~TEXT
        Unable to update settings from environment due to NoMethodError. This could be due
        to migrations needing to run on the settings object itself. In this case, we allow
        the settings update from environment to fail gracefully. If this error persists
        or occurs outside of migrations, it should be investigated.
    TEXT
  rescue ActiveRecord::NoDatabaseError, PG::UndefinedTable
    Rails.logger.warn <<~TEXT
        Unable to update settings from environment due to ActiveRecord::NoDatabaseError or
        PG::UndefinedTable. This is likely due to the update being run during setup,
        before the DB or tables exist. In this case, we allow the settings update from
        environment to fail gracefully. If this error persists or occurs outside of
        project setup, it should be investigated.
    TEXT
  end
end
