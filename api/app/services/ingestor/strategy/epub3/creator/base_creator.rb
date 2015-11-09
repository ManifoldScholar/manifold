module Ingestor
  module Strategy
    module EPUB3
      module Creator
        # Abstract base class for EPUB3 ingestion creators
        #
        # @author Zach Davis
        class BaseCreator
          include Ingestor::Loggable
          attr_writer :existing
          def initialize(logger, metadata_node)
            @logger = logger
            @metadata_node = metadata_node
          end

          def existing(existing)
            self.existing = existing
          end


          def defaults(defaults, attributes)
            defaults.clone.merge(attributes.compact)
          end
        end
      end
    end
  end
end
