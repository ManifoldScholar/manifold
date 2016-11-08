module Factory
  # Returns a drive session object; used by the drive_resource importer
  class DriveSession

    # rubocop:disable LineLength
    def self.create_service_account_session
      config = {
        "type": "service_account",
        "project_id": ENV["GOOGLE_SERVICE_PROJECT_ID"],
        "private_key_id": ENV["GOOGLE_SERVICE_PRIVATE_KEY_ID"],
        "private_key": ENV["GOOGLE_SERVICE_PRIVATE_KEY"],
        "client_email": ENV["GOOGLE_SERVICE_CLIENT_EMAIL"],
        "client_id": ENV["GOOGLE_SERVICE_CLIENT_ID"],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/manifold-service%40appspot.gserviceaccount.com"
      }
      # rubocop:enable LineLength
      GoogleDrive::Session.from_service_account_key(StringIO.new(config.to_json))
    end

  end
end
