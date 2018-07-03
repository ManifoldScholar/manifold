require "filesize"
require "memoist"

module Ingestor
  module Strategy
    module GoogleDocMulti
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

        def session
          @session ||= self.class.session
        end

        # This is built upon when retrieving the docs.
        # This ultimately is passed to the ingestion to
        # map source urls to toc titles and doc filenames.
        def source_map
          @source_map ||= {}.with_indifferent_access
        end

        def pointer(url)
          if session.present?
            session.file_by_url(url)
          else
            raise IngestionFailed, "Unable to start google drive session.  Double check
            that google integration has been configured and the drive API enabled.
            See more at https://manifoldapp.org/docs/customizing/settings/external_services/google/index.html."
          end
        rescue Google::Apis::ClientError
          raise IngestionFailed, "Unable to fetch one or more google docs. Double check
          the share URLs and make sure the all docs are publicly available or available
          to the Manifold google service user."
        end

        def fetch_all
          inspector = self.class.inspector(@ingestion)
          inspector.source_items(inspector.toc).map do |item|
            fetch_one item
          end
          self
        end

        def fetch_one(item)
          pointer = pointer item[:url]
          contents = session.drive.export_file(pointer.id, "application/zip")
          tmp_file, tmp_path = @ingestion.write_tmp(pointer.title,
                                                    "zip",
                                                    contents,
                                                    root_dir: @ingestion.root_path)
          @ingestion.update_working_dir(tmp_path)
          tmp_file.unlink
          source_map.merge! map_url_to_file(item, pointer)
          tmp_path
        end

        def ingest
          text = @ingestion.text
          i = self.class.inspector(@ingestion, source_map)
          b = ::Ingestor::Strategy::GoogleDocMulti::Builder.new(i, @ingestion.logger)
          b.build(text)
          text
        end

        # Each entry here is pushed to the source_map.
        # We first hash the url to keep it consistent. We also
        # remove all whitespace from the filename because
        # that's how google docs returns them.
        def map_url_to_file(item, pointer)
          identifier = Digest::MD5.hexdigest item[:url]
          {}.tap do |hash|
            hash[identifier] = {
              title: item[:title],
              source_path: "#{pointer.title.delete(' ')}.html"
            }
          end
        end

        class << self
          def unique_id(ingestion)
            inspector(ingestion).unique_id
          end

          def can_ingest?(ingestion)
            inspector(ingestion).google_doc?
          end

          def ingest(ingestion)
            new(ingestion).fetch_all.ingest
          end

          def inspector(ingestion, map = {})
            ::Ingestor::Strategy::GoogleDocMulti::Inspector::GoogleDoc.new(ingestion, map)
          end

          def session
            ::Factory::DriveSession.create_service_account_session
          end
        end

      end
    end
  end
end
