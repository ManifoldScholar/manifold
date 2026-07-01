# frozen_string_literal: true

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
        drive_download_error
      end

      def fetch
        drive_session_error unless session.present?

        fetch_from_drive
      rescue Google::Apis::ClientError
        info "services.ingestions.fetcher.log.drive_failed_direct_fallback"
        fetch_direct_download
      rescue OpenSSL::PKey::RSAError
        drive_session_error
      rescue Signet::AuthorizationError
        authorization_error
      end

      # Attempt to fetch the file contents from Google Drive service
      def fetch_from_drive
        session.drive.export_file(
          drive_file_pointer.id,
          "text/html",
          download_dest: temp_file.path
        )
      end

      def fetch_direct_download
        href = drive_file_pointer.export_links&.[]("text/html")
        return drive_download_error if href.blank?

        response = Faraday.get(href)
        response.success? ? temp_file.write(response.body) : drive_download_error
      rescue Faraday::ConnectionFailed
        drive_download_error
      end

      def drive_session_error
        raise Fetchers::FetchFailed,
              "Unable to start google drive session."
      end

      def authorization_error
        raise Fetchers::FetchFailed,
              "Unable to start google drive session due to authorization error."
      end

      def drive_download_error
        raise Fetchers::FetchFailed,
              "Unable to fetch file from Google Drive."
      end
    end
  end
end
