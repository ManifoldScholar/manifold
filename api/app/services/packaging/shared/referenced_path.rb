module Packaging
  module Shared
    class ReferencedPath
      extend Dry::Initializer
      extend Memoist

      include Dry::Equalizer.new(:path)

      param :path, Types::Strict::String

      delegate :external?, :ingestion_source?, :legacy_ingestion_source?, :text_section_link?, to: :strategy

      def absolute_uri?
        path.starts_with?("/")
      end

      # @!attribute [r] attachment_id
      # @return [String, nil]
      def attachment_id
        derived_path_values[:attachment_id]
      end

      # @!attribute [r] derived_ingestion_source
      # @return [IngestionSource, nil]
      memoize def derived_ingestion_source
        return IngestionSource.find_by_attachment_id(attachment_id) if legacy_ingestion_source?

        IngestionSource.find ingestion_source_id if has_ingestion_source?
      end

      def has_ingestion_source?
        ingestion_source? || legacy_ingestion_source?
      end

      # @!attribute [r] ingestion_source_id
      # @return [String, nil]
      def ingestion_source_id
        derived_path_values[:ingestion_source_id]
      end

      # @!attribute [r] strategy
      # @return [ReferencedPathStrategy]
      def strategy
        derived_path_values[:strategy]
      end

      # @return [String, nil]
      def text_id
        derived_path_values[:text_id]
      end

      # @return [String, nil]
      def text_section_id
        derived_path_values[:text_section_id]
      end

      private

      def build_strategy(enum)
        ReferencedPathStrategy.build(enum, owner: self)
      end

      memoize def derived_path_values
        {}.with_indifferent_access.tap do |h|
          ReferencedPathStrategy.find_for(path) do |m|
            m.success do |(enum, path_values)|
              h[:strategy] = build_strategy(enum)
              h.merge!(path_values)
            end

            m.failure do |(enum, _)|
              h[:strategy] = build_strategy(enum)
            end
          end
        end
      end
    end
  end
end
