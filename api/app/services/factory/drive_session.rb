module Factory
  # Returns a drive session object; used by the drive_resource importer
  class DriveSession

    # rubocop:disable LineLength, Metrics/AbcSize
    def self.create_service_account_session
      config = {
        "type": "service_account",
        "project_id": Rails.configuration.manifold.google.service_project_id,
        "private_key_id": Rails.configuration.manifold.google.service_private_key_id,
        "private_key": Rails.configuration.manifold.google.service_private_key,
        "client_email": Rails.configuration.manifold.google.client_email,
        "client_id": Rails.configuration.manifold.google.service_client_id,
        "auth_uri": Rails.configuration.manifold.google.auth_uri,
        "token_uri": Rails.configuration.manifold.google.token_uri,
        "auth_provider_x509_cert_url": Rails.configuration.manifold.google.auth_provider_x509_cert_url,
        "client_x509_cert_url": Rails.configuration.manifold.google.client_x509_cert_url
      }
      # rubocop:enable LineLength, Metrics/AbcSize
      GoogleDrive::Session.from_service_account_key(StringIO.new(config.to_json))
    end

  end
end
