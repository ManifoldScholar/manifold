module Ingestor
  module Strategy
    module EPUB3
      # rubocop: disable Metrics/ClassLength
      class Builder
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
          transform_text_sections!(text)
          validate_text(text)
          attempt_save!(text)
        end

        def update_text!(text)
          update_unique_id!(text)
          update_titles!(text)
          update_creators!(text)
          update_contributors!(text)
          update_language!(text)
          update_date!(text)
          update_rights!(text)
          update_description!(text)
          update_resources!(text)
          update_text_sections!(text)
          attempt_save!(text)
          update_cover_image!(text)
          update_structures!(text)
        end

        def validate_text(text)
          Helper::Validator.validate_ingestion_sources(text, @logger)
          Helper::Validator.validate_resources(text, @logger)
          Helper::Validator.validate_text_sections(text, @logger)
        end

        def transform_text_sections!(text)
          transformer = Transformer::TextSection.new(text, @logger)
          text.text_sections.each do |ts|
            key = "services.ingestor.strategy.epub3.log.transform_ts"
            @logger.info I18n.t(key, name: ts.name, id: ts.id)
            ts.body = transformer.convert_cont_doc_body(ts.source_body,
                                                        ts.source_path)
            ts.body_json = transformer.convert_cont_doc_body_to_json(ts.body)
            ts.save
          end
        end

        def update_structures!(text)
          structure = @inspector.toc_inspector.text_structure
          structure = Transformer::TOCStructure.transform(structure, text)
          update_toc!(text, structure)
          update_page_list!(text, structure)
          update_landmarks!(text, structure)
          text.structure_titles = structure[:titles]
        end

        def update_toc!(text, structure)
          text.toc = structure[:toc]
          @logger.info "Looking for TOC structure"
          Helper::Log.log_structure(text.toc, "  TOC: ", @logger)
        end

        def update_page_list!(text, structure)
          text.page_list = structure[:page_list]
          @logger.info "Looking for Page List structure"
          Helper::Log.log_structure(text.page_list, "  Page List: ", @logger)
        end

        def update_landmarks!(text, structure)
          text.landmarks = structure[:landmarks]
          @logger.info "Looking for Landmark structure"
          Helper::Log.log_structure(text.landmarks, "  Landmarks: ", @logger)
        end

        def attempt_save!(text)
          debug "services.ingestor.strategy.epub3.log.attempt_save"
          if text.valid?
            text.save
          else
            Helper::Log.log_text_errors(text, @logger)
            fail IngestionFailed, "services.ingestor.strategy.epub3.fail.save_fail"
          end
        end

        def update_text_sections!(text)
          creator = Creator::TextSections.new(@logger, @inspector.metadata_node)
          text_sections = creator.create(@inspector.spine_item_nodes, @inspector,
                                         text, text.text_sections)
          text.text_sections.replace(text_sections.reject(&:nil?))
        end

        def update_resources!(text)
          creator = Creator::Resources.new(@logger, @inspector.metadata_node)
          path = text.title.parameterize.underscore
          ingestion_sources = creator.create(@inspector.manifest_item_nodes, path,
                                             @inspector, text.ingestion_sources)
          text.ingestion_sources.replace(ingestion_sources)
        end

        def update_cover_image!(text)
          node_id = @inspector.manifest_cover_item_id
          return unless node_id
          source = text.ingestion_sources.where(source_identifier: node_id).first
          return unless source
          source.kind = IngestionSource::KIND_COVER_IMAGE
          source.save
        end

        def update_unique_id!(text)
          id = @inspector.unique_id
          unless id
            msg = I18n.t("services.ingestor.strategy.epub3.fail.missing_uid")
            fail IngestionFailed, msg
          end
          @logger.info("Unique identifier is \"#{id}\"")
          text.unique_identifier = @inspector.unique_id
        end

        def update_titles!(text)
          creator = Creator::TextTitles.new(@logger, @inspector.metadata_node)
          titles = creator.create(@inspector.title_nodes)
          text.titles.replace(titles)
        end

        def update_creators!(text)
          creator = Creator::Makers.new(@logger, @inspector.metadata_node)
          makers = creator.create(@inspector.creator_nodes, text.creators, "creator")
          text.creators.replace(makers)
        end

        def update_contributors!(text)
          creator = Creator::Makers.new(@logger, @inspector.metadata_node)
          makers = creator.create(@inspector.contributor_nodes, text.contributors,
                                  "contributor")
          text.contributors.replace(makers)
        end

        def update_language!(text)
          l = Inspector::Metadata.new(@inspector.language_node,
                                      @inspector.metadata_node).text
          return unless l.present?
          text.language = l
          info "services.ingestor.strategy.epub3.log.set_lang", lang: text.language
        end

        def update_date!(text)
          d = Inspector::Metadata.new(@inspector.date_node,
                                      @inspector.metadata_node).text
          return unless d.present?
          text.publication_date = d
          info "services.ingestor.strategy.epub3.log.set_date",
               date: text.publication_date
        end

        def update_rights!(text)
          r = Inspector::Metadata.new(@inspector.rights_node,
                                      @inspector.metadata_node).text
          return unless r.present?
          text.rights = r
          info "services.ingestor.strategy.epub3.log.set_rights", rights: text.rights
        end

        def update_description!(text)
          d = Inspector::Metadata.new(@inspector.description_node,
                                      @inspector.metadata_node).text
          return unless d.present?
          text.description = d
          info "services.ingestor.strategy.epub3.log.set_desc", desc: text.description
        end
      end
    end
  end
end
