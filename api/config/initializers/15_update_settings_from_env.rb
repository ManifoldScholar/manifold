Rails.application.configure do
  config.after_initialize do
    Settings.potentially_update_from_environment!
  end
end
