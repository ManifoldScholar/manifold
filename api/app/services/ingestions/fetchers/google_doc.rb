module Ingestions
  module Fetchers
    class GoogleDoc < Ingestions::Fetchers::AbstractFetcher

      def perform
        fetch
        { title: drive_file_pointer.title, file: temp_file }
      end

      # @return [Boolean]
      def determine_fetchability
        url.start_with?("https://docs.google.com")
      end

      protected

      def temp_file
        @temp_file ||=
          tmp_pointer("source", "html")
      end

      def session
        @session ||=
          ::Factory::DriveSession.create_service_account_session
      end

      def drive_file_pointer
        @drive_file_pointer ||=
          session.file_by_url(url)
      rescue Google::Apis::ClientError
        raise Fetchers::FetchFailed,
              "Unable to fetch google doc."
      end

      def fetch
        drive_session_error unless session.present?
        session.drive.export_file(
          drive_file_pointer.id,
          "text/html",
          download_dest: temp_file.path
        )
      rescue OpenSSL::PKey::RSAError
        drive_session_error
      rescue Signet::AuthorizationError
        authorization_error
      end

      def drive_session_error
        raise Fetchers::FetchFailed,
              "Unable to start google drive session."
      end

      def authorization_error
        raise Fetchers::FetchFailed,
              "Unable to start google drive session due to authorization error."
      end

    end
  end
end
