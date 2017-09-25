require "filesize"

module Ingestor
  module Strategy
    module EPUB
      # The <tt>Ingestor::Strategy::EPUB</tt> class provides a strategy for ingesting
      # EPUB documents into Manifold.
      #
      # @author Zach Davis
      class Strategy < Ingestor::Strategy::Base
        include Ingestor::Loggable

        def self.label
          "EPUB"
        end

        # Return true if epub file or is a url to an EPUB file
        def self.can_ingest?(ingestion)
          ingestion.dir?("META-INF") || epub_url?(ingestion)
        end

        # Returns an MD5 string of file contents if ingestion is a url OR
        # returns the EPUB's unique identifier
        def self.unique_id(ingestion)
          inspector(ingestion).unique_id
        end

        def self.inspector(ingestion)
          ::Ingestor::Strategy::EPUB::Inspector::EPUB.new(ingestion)
        end

        def self.ingest(ingestion)
          return new(ingestion).fetch(ingestion).ingest if epub_url?(ingestion)
          new(ingestion).ingest
        end

        def initialize(ingestion)
          @ingestion = ingestion
          @logger = @ingestion.logger ||
                    Naught.build { |config| config.mimic Logger }
        end

        def ingest
          text = @ingestion.text
          i = self.class.inspector(@ingestion)
          info "services.ingestor.strategy.ePUB.log.version",
               version: i.epub_version
          b = ::Ingestor::Strategy::EPUB::Builder.new(i, @ingestion.logger)
          b.build(text)
          text
        end

        # Return true if ingestion has a url to a file ending with an EPUB extension
        def self.epub_url?(ingestion)
          return false unless ingestion.url?
          File.extname(ingestion.source_url).include? "epub"
        end

        # Fetches and writes the contents of the file at the end of the ingestion URL to
        # a temporary file for ingestion
        def fetch(ingestion)
          tmp_file, tmp_path = @ingestion.write_tmp(
            "epub_ingestion",
            "epub",
            url: ingestion.source_url
          )
          @ingestion.update_working_dir(tmp_path)
          self
        ensure
          tmp_file.unlink
        end
      end
    end
  end
end
