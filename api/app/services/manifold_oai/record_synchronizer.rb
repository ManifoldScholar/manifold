# frozen_string_literal: true

module ManifoldOAI
  class RecordSynchronizer
    include Dry::Monads[:result]
    include Dry::Initializer[undefined: false].define -> do
      param :source, Types::RecordSource
    end

    # @return [ManifoldOAIRecord]
    attr_reader :record

    # @return [Dry::Monads::Result(void)]
    def call
      prepare!

      assign_metadata!

      record.save!

      maybe_link_project!

      maybe_link_journal!

      maybe_link_to_directory!

      Success(record)
    end

    private

    # @return [void]
    def assign_metadata!
      @record.oai_dc_content = extract_oai_dc_from_source
    end

    # rubocop:disable Metrics/MethodLength
    def extract_oai_dc_from_source
      metadata = source.metadata
      subjects = source.subjects

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
              xml["dc"].collaborator(editor)
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

      builder.doc.root.to_xml
    end
    # rubocop:enable Metrics/MethodLength

    # @return [void]
    def prepare!
      @record = ManifoldOAIRecord.where(source:).first_or_initialize
      @projects_set = ManifoldOAISet.fetch_projects!
      @journals_set = ManifoldOAISet.fetch_journals!
      @directory_set = ManifoldOAISet.fetch_directory!
    end

    # @return [void]
    def maybe_link_project!
      # :nocov:
      return unless source.kind_of?(Project)
      # :nocov:

      @projects_set.link! record
    end

    # @return [void]
    def maybe_link_journal!
      # :nocov:
      return unless source.kind_of?(Journal)
      # :nocov:

      @journals_set.link! record
    end

    # @return [void]
    def maybe_link_to_directory!
      # :nocov:
      return if @directory_set.nil?
      # :nocov:

      should_exclude = source.exclude_from_directory ||
                      (source.is_a?(Project) && source.journal_issue_id.present?)

      if should_exclude
        # Remove from directory set if previously linked
        unlink_from_directory!
      else
        # Add to directory set
        case source
        when Project, Journal
          @directory_set.link! record
        end
      end
    end

    # @return [void]
    def unlink_from_directory!
      return if @directory_set.nil? || record.nil?

      ManifoldOAISetLink.where(
        manifold_oai_set: @directory_set,
        manifold_oai_record: record
      ).destroy_all
    end
  end
end
