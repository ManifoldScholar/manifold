require 'filesize'

module Ingestor
  module Strategy
    module EPUB3
      class Strategy < Ingestor::Strategy::Base

        def initialize(ingestion)
          @ingestion = ingestion
          @inspector = Inspector::EPUB.new(@ingestion.source_path, @ingestion.logger)
          @logger = @ingestion.logger || Naught.build { |config| config.mimic Logger }
        end

        def self.can_ingest?(ingestion)
          inspector = Inspector::EPUB.new(ingestion.source_path, ingestion.logger)
          return false if inspector.epub_extension != 'epub'
          return false if inspector.epub_version != '3.0'
          return true
        end

        def self.unique_id(ingestion)
          inspector = Inspector::EPUB.new(ingestion.source_path, ingestion.logger)
          inspector.unique_id
        end

        def self.ingest(ingestion)
          new(ingestion).ingest
        end

        def ingest
          text = @ingestion.text
          ActiveRecord::Base.transaction do
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
            update_structure!(text)
            Helper::Validator::validate_ingestion_sources(text, @logger)
            Helper::Validator::validate_resources(text, @logger)
            Helper::Validator::validate_text_sections(text, @logger)
            attempt_save!(text)
          end
          transform_text_sections!(text)
          Helper::Validator::validate_text_sections(text, @logger)
          attempt_save!(text)

        end

        private

        def transform_text_sections!(text)
          transformer = Transformer::TextSection.new(text, @logger)
          text.text_sections.each do |ts|
            @logger.info "Transforming text section \"#{ts.name}\" body. [id #{ts.id}]"
            ts.body = transformer.convert_cont_doc_body(ts.source_body, ts.source_path)
            ts.save
          end
        end

        def update_structure!(text)
          structure = @inspector.toc_inspector.text_structure
          structure = Transformer::TOCStructure::convert(structure, text)
          text.toc = structure[:toc]
          @logger.info "Looking for TOC structure"
          Helper::Log::log_structure(text.toc, "  TOC: ", @logger)
          text.page_list = structure[:page_list]
          @logger.info "Looking for Page List structure"
          Helper::Log::log_structure(text.page_list, "  Page List: ", @logger)
          text.landmarks = structure[:landmarks]
          @logger.info "Looking for Landmark structure"
          Helper::Log::log_structure(text.landmarks, "  Landmarks: ", @logger)
          text.structure_titles = structure[:titles]
        end


        def attempt_save!(text)
          @logger.debug "Attempting to save text"
          if text.valid?
            text.save
          else
            text.errors.full_messages.each do |msg|
              @logger.error "  #{msg}"
            end
            text.titles.each do |source|
              if !source.valid?
                @logger.error source.errors.full_messages
              end
            end
            text.ingestion_sources.each do |source|
              if !source.valid?
                @logger.error source.errors.full_messages
              end
            end

            raise IngestionFailed, "Unable to save text due to errors."
          end
        end

        def update_text_sections!(text)
          text_sections = @inspector.spine_item_nodes.each_with_index.map do |node, index|
            item_inspector = Inspector::SpineItem.new(node)
            contdoc_xml = @inspector.spine_item_xml(item_inspector.idref)
            contdoc_inspector = Inspector::ContDoc.new(contdoc_xml, node, @inspector)

            section = text.text_sections.find_or_initialize_by({
                                                                       source_identifier: item_inspector.idref
                                                                   })
            section.name = contdoc_inspector.guess_name()

            @logger.debug "Found name for contdoc #{item_inspector.idref}: \"#{section.name}\""
            section.source_body = contdoc_inspector.body
            @logger.debug "Found kind for contdoc #{item_inspector.idref}: \"#{contdoc_inspector.kind}\""
            section.kind = contdoc_inspector.kind
            section.source_identifier = item_inspector.idref
            section.resource = text.find_ingestion_source_by_identifier(item_inspector.idref).resource
            section
          end
          abort
          text.text_sections.replace(text_sections.reject { |cd| cd.nil? })
        end

        def update_resources!(text)
          ingestion_sources = @inspector.manifest_item_nodes.map do |node|
            item_inspector = Inspector::ManifestItem.new(node)
            ingestion_source = text.ingestion_sources.find_or_initialize_by({
                                                                                source_identifier: item_inspector.id,
                                                                                source_path: item_inspector.href,
                                                                                kind: item_inspector.kind.presence || IngestionSource::KIND_PUBLICATION_RESOURCE
                                                                            })
            resource = ingestion_source.resource || ingestion_source.build_resource
            resource.name = "source/#{text.title.parameterize.underscore}/#{item_inspector.id}"
            resource.attachment = @inspector.get_rendition_source(item_inspector.href)
            ingestion_source

          end
          text.ingestion_sources.replace(ingestion_sources)
        end

        def update_cover_image!(text)
          node_id = @inspector.manifest_cover_item_id
          if node_id
            source = text.ingestion_sources.where(:source_identifier => node_id).first
            if source
              source.kind = IngestionSource::KIND_COVER_IMAGE
              source.save
            end
          end
        end

        def update_unique_id!(text)
          id = @inspector.unique_id
          if !id
            raise IngestionFailed, "Ingestion Failed: unable to find a unique identifier for this EPUB."
          end
          @logger.info("Unique identifier is \"#{id}\"")
          text.unique_identifier = @inspector.unique_id
        end

        def update_titles!(text)
          titles = @inspector.title_nodes.each_with_index.map do |title_node, index|
            node_inspector = Inspector::Metadata.new(title_node, @inspector.metadata_node)
            kind = TextTitle::ALLOWED_KINDS.include?(node_inspector.kind.presence) ? node_inspector.kind : TextTitle::KIND_MAIN
            title = TextTitle.new({
                                  value: node_inspector.text.presence || 'Untitled',
                                  position: node_inspector.position.presence || index,
                                  kind: kind
                              })
            @logger.info "Creating a title object: \"#{title.value}\""
            title
          end
          text.titles.replace(titles)
        end

        def update_creators!(text)
          makers = @inspector.creator_nodes.each_with_index.map do |node, index|
            node_inspector = Inspector::Metadata.new(node, @inspector.metadata_node)
            maker = text.creators.find_or_initialize_by({
                                                name: node_inspector.text,
                                                sort_name: node_inspector.file_as
                                            })
            if maker.new_record?
              @logger.info "New creator: \"#{maker.name}\""
            else
              @logger.info "Setting maker \"#{maker.name}\" role to \"creator\""
            end
            maker
          end
          text.creators.replace(makers)
        end

        def update_contributors!(text)
          makers = @inspector.contributor_nodes.each_with_index.map do |node, index|
            node_inspector = Inspector::Metadata.new(node, @inspector.metadata_node)
            maker = text.contributors.find_or_initialize_by({
                                                            name: node_inspector.text,
                                                            sort_name: node_inspector.file_as
                                                        })
            if maker.new_record?
              @logger.info "New contributor: \"#{maker.name}\""
            else
              @logger.info "Setting maker \"#{maker.name}\" role to \"contributor\""
            end
            maker
          end
          text.creators.replace(makers)
        end

        def update_language!(text)
          l = Inspector::Metadata.new(@inspector.language_node, @inspector.metadata_node).text
          if l.present?
            text.language = l
            @logger.info "Setting language to \"#{text.language}\""
          end
        end

        def update_date!(text)
          d = Inspector::Metadata.new(@inspector.date_node, @inspector.metadata_node).text
          if d.present?
            text.publication_date = d
            @logger.info "Setting publication date to \"#{text.publication_date}\""
          end
        end

        def update_rights!(text)
          r = Inspector::Metadata.new(@inspector.rights_node, @inspector.metadata_node).text
          if r.present?
            text.rights = r
            @logger.info "Setting rights to \"#{text.rights}\""
          end
        end

        def update_description!(text)
          d = Inspector::Metadata.new(@inspector.description_node, @inspector.metadata_node).text
          if d.present?
            text.description = d
            @logger.info "Setting description to \"#{text.description}\""
          end
        end
      end
    end
  end
end