update = true
update = false if ENV["MANAGE_SETTINGS_FROM_ENV"].present?
update = false if ActiveRecord::Base.connection.data_source_exists?("settings")
Settings.instance.update_from_environment if update
