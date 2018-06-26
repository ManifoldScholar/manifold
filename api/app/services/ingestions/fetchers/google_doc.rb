module Ingestions
  module Fetchers
    class GoogleDoc < Ingestions::Fetchers::AbstractFetcher

      def perform
        fetch
        temp_file
      end

      # @return [Boolean]
      def determine_fetchability
        url.start_with?("https://docs.google.com")
      end

      protected

      def temp_file
        @temp_file ||=
          tmp_pointer("source", "zip")
      end

      def session
        @session ||=
          ::Factory::DriveSession.create_service_account_session
      end

      def drive_file_pointer
        @drive_file_pointer ||=
          session.file_by_url(url)
      end

      def fetch
        return unless session.present?
        session.drive.export_file(
          drive_file_pointer.id,
          "application/zip",
          download_dest: temp_file.path
        )
      end

    end
  end
end
