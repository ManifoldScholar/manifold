module Factory
  # Returns a drive session object; used by the drive_resource importer
  class DriveSession

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def self.config
      db_config = ActiveRecord::Base.connection_pool.with_connection do |conn|
        Rails.application.executor.wrap do
          conn.select_one <<~SQL
            SELECT
              integrations ->> 'google_project_id' AS google_project_id,
              integrations ->> 'google_private_key_id' AS google_private_key_id,
              secrets ->> 'google_private_key' AS google_private_key,
              integrations ->> 'google_client_email' AS google_client_email,
              integrations ->> 'google_client_id' AS google_client_id
            FROM settings
          SQL
        end
      end

      db_config = db_config.nil? ? {} : db_config

      client_x509_cert_url = nil
      if Rails.configuration.manifold.google.client_x509_cert_url && db_config["google_client_email"]
        client_x509_cert_url = Rails.configuration.manifold.google.client_x509_cert_url + db_config["google_client_email"]
      end
      {
        "type": "service_account",
        "project_id": db_config["google_project_id"],
        "private_key_id": db_config["google_private_key_id"],
        "private_key": db_config["google_private_key"],
        "client_email": db_config["google_client_email"],
        "client_id": db_config["google_client_id"],
        "auth_uri": Rails.configuration.manifold.google.auth_uri,
        "token_uri": Rails.configuration.manifold.google.token_uri,
        "auth_provider_x509_cert_url": Rails.configuration.manifold.google.auth_provider_x509_cert_url,
        "client_x509_cert_url": client_x509_cert_url
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    def self.create_service_account_session
      fetched_config = config
      return unless fetched_config[:private_key]

      GoogleDrive::Session.from_service_account_key(StringIO.new(config.to_json))
    end

  end
end
