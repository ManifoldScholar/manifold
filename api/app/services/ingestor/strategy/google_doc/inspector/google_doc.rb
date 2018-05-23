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

          def unique_id
            Digest::MD5.hexdigest(ingestion.source_url)
          end

          def google_doc?
            @ingestion.url?
          end

          def title
            @pointer.title
          end
        end
      end
    end
  end
end
