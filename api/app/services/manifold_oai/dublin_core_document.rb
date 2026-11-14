# frozen_string_literal: true

module ManifoldOAI
  # Builds `oai_dc` Dublin Core XML used both for OAI-PMH record metadata and for
  # set `<setDescription>` content.
  class DublinCoreDocument
    NAMESPACES = {
      "xmlns:oai_dc": "http://www.openarchives.org/OAI/2.0/oai_dc/",
      "xmlns:dc": "http://purl.org/dc/elements/1.1/",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xsi:schemaLocations": %{
        http://www.openarchives.org/OAI/2.0/oai_dc/
        http://www.openarchives.org/OAI/2.0/oai_dc.xsd
      }.squish,
    }.freeze

    # Wraps the caller's `dc` elements in an `oai_dc:dc` envelope.
    #
    # @yieldparam [Nokogiri::XML::Builder] xml
    # @return [String]
    def self.envelope(&content)
      builder = Nokogiri::XML::Builder.new do |xml|
        xml["oai_dc"].dc(NAMESPACES) do
          content.call(xml)
        end
      end

      builder.doc.root.to_xml
    end

    # @param [String] title
    # @param [String, nil] description
    # @return [String]
    def self.minimal(title:, description: nil)
      envelope do |xml|
        xml["dc"].title(title) if title.present?
        xml["dc"].description(description) if description.present?
      end
    end

    # Builds the full Dublin Core document for a project- or journal-like record source.
    #
    # @param [ManifoldOAIRecordSource] source
    # @return [String]
    def self.from_record_source(source)
      metadata = source.metadata
      subjects = source.subjects

      envelope do |xml|
        xml["dc"].identifier(source.canonical_url)
        xml["dc"].type(source.model_name.name)
        xml["dc"].title(source.title)
        xml["dc"].title(source.subtitle) if source.subtitle.present?
        xml["dc"].description(source.description) if source.description.present?
        xml["dc"].date(source.publication_date.iso8601) if source.respond_to?(:publication_date) && source.publication_date.present?
        xml["dc"].date("info:eu-repo/date/updatedAt/#{source.updated_at.iso8601}")
        xml["dc"].publisher(metadata[:publisher]) if metadata[:publisher].present?

        if source.license.present?
          xml["dc"].rights(source.license.label)
        elsif metadata[:rights].present?
          xml["dc"].rights(metadata[:rights])
        end
        xml["dc"].rights(metadata[:rights_holder]) if metadata[:rights_holder].present?

        unless source.creator_names_array.empty?
          source.creator_names_array.each do |creator|
            xml["dc"].creator(creator)
          end
        end

        unless source.editor_names_array.empty?
          source.editor_names_array.each do |editor|
            xml["dc"].contributor(editor)
          end
        end

        xml["dc"].identifier("info:eu-repo/semantics/altIdentifier/isbn/#{metadata[:isbn]}") if metadata[:isbn].present?
        xml["dc"].relation("info:eu-repo/semantics/reference/issn/#{metadata[:issn]}") if metadata[:issn].present?

        if metadata[:doi].present?
          doi = metadata[:doi]
          value = doi.match?(%r{\Ahttps?://doi\.org/}) ? doi : "https://doi.org/#{doi}"
          xml["dc"].identifier(value)
        end

        if source.avatar_attacher.stored?
          source.avatar(:medium_portrait).then do |avatar|
            next unless avatar

            xml["dc"].format(avatar.content_type)
            xml["dc"].relation(avatar.url)
          end
        end

        subjects.each do |subject|
          xml["dc"].subject(subject.name)
        end
      end
    end
  end
end
