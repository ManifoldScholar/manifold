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
          tmp_pointer("source", "zip")
      end

      def session
        @session ||=
          ::Factory::DriveSession.create_service_account_session
      end

      def drive_file_pointer
        @drive_file_pointer ||=
          session.file_by_url(url)
      rescue Google::Apis::ClientError
        raise Fetchers::FetchFailed, "Unable to fetch google doc. Double check the share
          URL and make sure the doc is publicly available or available to the Manifold
          google service user."
      end

      def fetch
        drive_session_error unless session.present?
        session.drive.export_file(
          drive_file_pointer.id,
          "application/zip",
          download_dest: temp_file.path
        )
      end

      def drive_session_error
        raise Fetchers::FetchFailed, "Unable to start google drive session.  Double check
            that google integration has been configured and the drive API enabled.
            See more at https://manifoldapp.org/docs/customizing/settings/external_services/google/index.html."
      end

    end
  end
end
