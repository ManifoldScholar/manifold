namespace :manifold do
  namespace :settings do
    desc "Update DB settings from environment"
    task :update_from_env, [:path] => :environment do |_t, _args|
      Settings.potentially_update_from_environment!
      puts "Settings updated."
    end

    desc "Abort without a google service key"
    task :abort_without_google_service_key, [:path] => :environment do |_t, _args|
      next if Settings.instance.integrations[:google_client_email].present?

      abort %{Aborting because Settings.instance.integrations[:google_client_email].present? is false.}
    end
  end
end
