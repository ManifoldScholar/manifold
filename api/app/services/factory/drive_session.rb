module Factory
  # Returns a drive session object; used by the drive_resource importer
  class DriveSession

    # rubocop:disable Metrics/AbcSize, Metrics/LineLength
    def self.config
      settings = Settings.instance
      {
        "type": "service_account",
        "project_id": settings.integrations.dig(:google_project_id),
        "private_key_id": settings.integrations.dig(:google_private_key_id),
        "private_key": settings.secrets.dig(:google_private_key),
        "client_email": settings.integrations.dig(:google_client_email),
        "client_id": settings.integrations.dig(:google_client_id),
        "auth_uri": Rails.configuration.manifold.google.auth_uri,
        "token_uri": Rails.configuration.manifold.google.token_uri,
        "auth_provider_x509_cert_url": Rails.configuration.manifold.google.auth_provider_x509_cert_url,
        "client_x509_cert_url": Rails.configuration.manifold.google.client_x509_cert_url + settings.integrations.dig(:google_client_email)
      }
    end

    def self.create_service_account_session
      settings = Settings.instance
      return unless settings.secrets.dig(:google_private_key)
      GoogleDrive::Session.from_service_account_key(StringIO.new(config.to_json))
    end
    # rubocop:enable Metrics/AbcSize, Metrics/LineLength

  end
end
