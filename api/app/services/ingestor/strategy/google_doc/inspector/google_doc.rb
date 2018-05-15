require "digest/md5"

module Ingestor
  module Strategy
    module GoogleDoc
      module Inspector
        class GoogleDoc < Ingestor::Strategy::Html::Inspector::Html

          def initialize(ingestion, pointer)
            @ingestion = ingestion
            @pointer = pointer
          end

          def empty_collection(*_args)
            []
          end
          alias toc empty_collection
          alias page_list empty_collection
          alias landmarks empty_collection

          def unique_id
            Digest::MD5.hexdigest(ingestion.source_url)
          end

          def google_doc?
            @ingestion.url?
          end

          def title
            @pointer.title
          end

          # For google doc, we don't know what the HTML file
          # will be called, so we just get the first (only) one.
          def index_path
            ingestion.rel_path_for_file "*", %w(htm html)
          end
        end
      end
    end
  end
end
