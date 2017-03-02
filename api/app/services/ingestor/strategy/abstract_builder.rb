module Ingestor
  module Strategy
    # rubocop: disable Metrics/ClassLength
    class AbstractBuilder
      include Ingestor::Loggable

      def initialize(inspector, logger = nil)
        @inspector = inspector
        @logger = logger || Naught.build { |config| config.mimic Logger }
      end

      def build(text)
        ActiveRecord::Base.transaction do
          update_text!(text)
          validate_text(text)
          attempt_save!(text)
        end
        transform_stylesheets!(text)
        transform_text_sections!(text)
        validate_text(text)
        attempt_save!(text)
        destroy_tmp
      end

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def update_text!(text)
        update_unique_id!(text)
        update_titles!(text)
        update_creators!(text)
        update_contributors!(text)
        update_language!(text)
        update_date!(text)
        update_rights!(text)
        update_description!(text)
        attempt_save!(text)
        update_ingestion_sources!(text)
        update_stylesheets!(text)
        update_text_sections!(text)
        attempt_save!(text)
        update_spine!(text)
        update_cover_image!(text)
        update_start_section!(text)
        update_toc!(text)
        update_page_list!(text)
        update_landmarks!(text)
      end
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize

      def validate_text(text)
        ::Ingestor::Helper::Validator.validate_ingestion_sources(text, @logger)
        ::Ingestor::Helper::Validator.validate_text_sections(text, @logger)
      end

      def transform_stylesheets!(text)
        info "services.ingestor.strategy.ePUB.log.transforming_ss"
        transformer = ::Ingestor::Transformer::Stylesheet.new(text, @logger)
        text.stylesheets.each do |ss|
          key = "services.ingestor.strategy.ePUB.log.transform_ss"
          debug key, name: ss.name, id: ss.id
          ss.styles = transformer.transform_styles(ss.raw_styles)
          ss.save
        end
      end

      def transform_text_sections!(text)
        info "services.ingestor.strategy.ePUB.log.transforming_ts"
        transformer = ::Ingestor::Transformer::TextSection.new(text, @logger)
        text.text_sections.each do |ts|
          key = "services.ingestor.strategy.ePUB.log.transform_ts"
          debug key, name: ts.name, id: ts.id
          ts.body = transformer.convert_cont_doc_body(ts.source_body,
                                                      ts.source_path)
          ts.body_json = transformer.convert_cont_doc_body_to_json(ts.body)
          ts.save
        end
      end

      def attempt_save!(text)
        info "services.ingestor.strategy.log.attempt_save"
        if text.valid?
          text.save
        else
          Helper::Log.log_text_errors(text, @logger)
          error "services.ingestor.strategy.fail.save_fail"
          raise IngestionFailed
        end
      end

      def title_inspectors
        raise_missing_inspector("title_inspectors")
      end

      def creator_inspectors
        raise_missing_inspector("creator_inspectors")
      end

      def contributor_inspectors
        raise_missing_inspector("contributor_inspectors")
      end

      def language_inspector
        raise_missing_inspector("language_inspector")
      end

      def date_inspector
        raise_missing_inspector("date_inspector")
      end

      def unique_id_inspector
        raise_missing_inspector("unique_id_inspector")
      end

      def rights_inspector
        raise_missing_inspector("rights_inspector")
      end

      def description_inspector
        raise_missing_inspector("description_inspector")
      end

      def ingestion_sources_inspector
        raise_missing_inspector("ingestion_sources_inspector")
      end

      def stylesheets_inspector
        raise_missing_inspector("stylesheets_inspector")
      end

      def text_sections_inspector
        raise_missing_inspector("text_sections_inspector")
      end

      def cover_inspector
        raise_missing_inspector("cover_inspector")
      end

      def spine_inspector
        raise_missing_inspector("spine_inpsector")
      end

      def structure_inspector
        raise_missing_inspector("structure_inspector")
      end

      def start_section_inspector
        raise_missing_inspector("start_section")
      end

      def raise_missing_inspector(name)
        raise NotImplementedError, "Builder should implement '#{name}'"
      end

      def update_start_section!(text)
        start_section_identifier = start_section_inspector.start_section_identifier
        return unless start_section_identifier
        text_section = text.text_sections.find_by(
          source_identifier: start_section_identifier
        )
        return unless text_section
        debug "services.ingestor.strategy.log.find_start_section",
              text_section.source_identifier
        text.start_text_section = text_section
      end

      def update_landmarks!(text)
        landmarks = structure_inspector.landmarks
        text.landmarks = ::Ingestor::Transformer::TOCStructure.transform(landmarks, text)
        debug "services.ingestor.strategy.log.find_landmark_structure"
        Helper::Log.log_structure(text.landmarks, "  Landmarks: ", @logger)
      end

      def update_page_list!(text)
        page_list = structure_inspector.page_list
        text.page_list = ::Ingestor::Transformer::TOCStructure.transform(page_list, text)
        debug "services.ingestor.strategy.log.find_page_list_structure"
        Helper::Log.log_structure(text.page_list, "  Page List: ", @logger)
      end

      def update_toc!(text)
        toc = structure_inspector.toc
        text.toc = ::Ingestor::Transformer::TOCStructure.transform(toc, text)
        debug "services.ingestor.strategy.log.find_toc_structure"
        Helper::Log.log_structure(text.toc, "  TOC: ", @logger)
      end

      def update_cover_image!(text)
        cover_ingestion_source = cover_inspector.cover(text)
        return unless cover_ingestion_source
        cover_ingestion_source.kind = IngestionSource::KIND_COVER_IMAGE
        cover_ingestion_source.save
        debug "services.ingestor.strategy.log.set_cover", cover: text.cover.source_path
      end

      def update_stylesheets!(text)
        creator = ::Ingestor::Creator::Stylesheets.new(@logger, text)
        stylesheets = creator.create(stylesheet_inspectors, text.stylesheets)
        stylesheets.each(&:save)
      end

      def update_text_sections!(text)
        creator = ::Ingestor::Creator::TextSections.new(@logger, text)
        text_sections = creator.create(text_section_inspectors, text.text_sections)
        text_sections.each(&:save)
      end

      def update_ingestion_sources!(text)
        creator = ::Ingestor::Creator::IngestionSources.new(@logger, text)
        sources = creator.create(ingestion_source_inspectors, text.ingestion_sources)
        sources.each(&:save)
      end

      def update_unique_id!(text)
        id = unique_id_inspector.unique_id
        unless id
          msg = I18n.t("services.ingestor.strategy.fail.missing_uid")
          raise IngestionFailed, msg
        end
        text.unique_identifier = unique_id_inspector.unique_id
      end

      #
      def update_titles!(text)
        creator = ::Ingestor::Creator::TextTitles.new(@logger, text)
        titles = creator.create(title_inspectors, text.titles)
        titles.each(&:save)
      end

      def update_creators!(text)
        creator = ::Ingestor::Creator::Collaborators.new(@logger, text)
        creators = creator.create(creator_inspectors)
        creators.each(&:save)
      end

      def update_contributors!(text)
        creator = ::Ingestor::Creator::Collaborators.new(@logger, text)
        creators = creator.create(contributor_inspectors)
        creators.each(&:save)
      end

      def update_spine!(text)
        creator = ::Ingestor::Creator::Spine.new(@logger, text)
        text.spine = creator.create(spine_inspector)
      end

      def update_language!(text)
        text.language = language_inspector.language
        debug "services.ingestor.strategy.log.set_lang", lang: text.language
      end

      def update_date!(text)
        text.publication_date = date_inspector.date
        debug "services.ingestor.strategy.log.set_date",
              date: text.publication_date
      end

      def update_rights!(text)
        text.rights = rights_inspector.rights
        debug "services.ingestor.strategy.log.set_rights",
              rights: text.rights
      end

      def update_description!(text)
        text.description = description_inspector.description
        debug "services.ingestor.strategy.log.set_desc",
              desc: text.description.truncate(40)
      end

      def destroy_tmp
        return false unless @inspector
        return false unless @inspector.respond_to? :remove_tmp
        @inspector.remove_tmp
        @logger.debug("Removed temporary files")
      end

    end
  end
end
