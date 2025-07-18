# frozen_string_literal: true

module ManifoldOAI
  class RecordSynchronizer
    include Dry::Monads[:result]
    include Dry::Initializer[undefined: false].define -> do
      param :source, Types::Source
    end

    # @return [ManifoldOAIRecord]
    attr_reader :record

    # @return [Dry::Monads::Result(void)]
    def call
      prepare!

      assign_metadata!

      record.save!

      Success(record)
    end

    private

    # @return [void]
    def assign_metadata!
      @record.oai_dc_content = extract_oai_dc_from_source
    end

    def dc_to_internal_metadata_map
      {
        title: :series_title,
        rights: :rights,
        publisher: :publisher,
        rightsHolder: :rights_holder,
      }
    end

    def extract_oai_dc_from_source
      metadata = source.metadata

      builder = Nokogiri::XML::Builder.new do |xml|
        xml["oai_dc"].dc(
          "xmlns:oai_dc": "http://www.openarchives.org/OAI/2.0/oai_dc/",
          "xmlns:dc": "http://purl.org/dc/elements/1.1/",
          "xmlns:xsi":  "http://www.w3.org/2001/XMLSchema-instance",
          "xsi:schemaLocations": %{
            http://www.openarchives.org/OAI/2.0/oai_dc/
            http://www.openarchives.org/OAI/2.0/oai_dc.xsd
          }.squish
        ) do
          dc_to_internal_metadata_map.each do |key, value|
            xml["oai_dc"].send(key, metadata[value])
          end
        end
      end

      builder.doc.root.to_xml
    end

    # @return [void]
    def prepare!
      @record = ManifoldOAIRecord.where(source:).first_or_initialize
    end
  end
end
