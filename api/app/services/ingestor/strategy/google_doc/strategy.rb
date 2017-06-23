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

        include Ingestor::Loggable
        extend Memoist

        def initialize(ingestion)
          @ingestion = ingestion
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
          new(ingestion).fetch(pointer).ingest(pointer)
        end

        def self.session
          ::Factory::DriveSession.create_service_account_session
        end

        def self.pointer(ingestion)
          session.file_by_url(ingestion.source_url)
        end

        def self.inspector(ingestion, pointer)
          ::Ingestor::Strategy::GoogleDoc::Inspector::GoogleDoc.new(ingestion, pointer)
        end

        def fetch(pointer)
          contents = self.class.session.drive.export_file(pointer.id, "text/html")
          encoded_contents = contents.encode("utf-8", invalid: :replace, undef: :replace)
          @ingestion.write("index.html", encoded_contents)
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
