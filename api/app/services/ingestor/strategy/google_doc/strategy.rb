require "filesize"
require "memoist"

module Ingestor
  module Strategy
    module GoogleDoc
      # The <tt>Ingestor::Strategy::GoogleDoc</tt> class provides a strategy for ingesting
      # Google Doc source documents into Manifold.
      #
      # @author Max Ono
      # @author Zach Davis
      class Strategy < Ingestor::Strategy::Base

        include Ingestions::Concerns::Loggable
        extend Memoist

        def initialize(ingestion)
          @ingestion = ingestion
        end

        def self.label
          "Google Document"
        end

        # Return true if the url is valid
        def self.can_ingest?(ingestion)
          return false unless ingestion.url?
          return false unless ingestion.source_url.start_with?("https://docs.google.com/")
          true
        end

        # Return an MD5 string of based on the file contents;
        def self.unique_id(ingestion)
          inspector(ingestion, pointer(ingestion)).unique_id
        end

        def self.ingest(ingestion)
          pointer = pointer(ingestion)
          new(ingestion).fetch(pointer).preprocess(pointer).ingest(pointer)
        end

        def self.session
          ::Factory::DriveSession.create_service_account_session
        end

        def self.pointer(ingestion)
          if session.present?
            session.file_by_url(ingestion.source_url)
          else
            raise IngestionFailed, "Unable to start google drive session.  Double check
            that google integration has been configured and the drive API enabled.
            See more at https://manifoldapp.org/docs/customizing/settings/external_services/google/index.html."
          end
        rescue Google::Apis::ClientError
          raise IngestionFailed, "Unable to fetch google doc. Double check the share URL
          and make sure the doc is publicly available or available to the Manifold
          google service user."
        end

        def self.inspector(ingestion, pointer)
          ::Ingestor::Strategy::GoogleDoc::Inspector::GoogleDoc.new(ingestion, pointer)
        end

        def fetch(pointer)
          contents = self.class.session.drive.export_file(pointer.id, "application/zip")
          tmp_file, tmp_path = @ingestion.write_tmp("gdoc_ingestion", "zip", contents)
          @ingestion.update_working_dir(tmp_path)
          tmp_file.unlink
          self
        end

        def preprocess(pointer)
          inspector = self.class.inspector(@ingestion, pointer)
          path = @ingestion.abs(inspector.index_path)
          ::Ingestor::Preprocessor::HTML.process!(path)
          self
        end

        def ingest(pointer)
          text = @ingestion.text
          i = self.class.inspector(@ingestion, pointer)
          b = ::Ingestor::Strategy::GoogleDoc::Builder.new(i, @ingestion.logger)
          b.build(text)
          text
        end

      end
    end
  end
end
