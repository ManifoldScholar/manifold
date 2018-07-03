module Ingestions
  module Strategy
    module Manifest
      class Inspector

        attr_reader :ingestion, :context, :source_map, :toc

        def initialize(context)
          @context = context
          @ingestion = context.ingestion
          @toc = parsed_toc
          @source_map = build_source_map
        end

        def unique_id
          Digest::MD5.hexdigest(manifest)
        end

        def title
          manifest_meta_tag "title"
        end

        def language
          manifest_meta_tag "language"
        end

        def rights
          manifest_meta_tag "rights"
        end

        def description
          manifest_meta_tag "description"
        end

        def date
          manifest_meta_tag "date"
        end

        def creators
          manifest_meta_tag "creators"
        end

        def contributors
          manifest_meta_tag "contributors"
        end

        def start_section_identifier
          section = toc.detect { |item| item["start_section"].present? }
          return nil unless section.present?
          Digest::MD5.hexdigest context.basename(section["source_path"])
        end

        def manifest_meta_tag(tag)
          manifest_parsed["meta"][tag]
        end

        def parsed_toc
          manifest_parsed["toc"]
        end

        def convertible_sources
          convertible = Ingestions.converters.convertible_extensions
          context.sources.select do |source|
            ext = File.extname(source).delete(".")
            convertible.include?(ext)
          end
        end

        def style_nodes
          xpath = "//*[@rel=\"stylesheet\" or @media=\"all\" or @media=\"screen\"] |
                    //style"

          convertible_sources.map do |source|
            file_parsed(source).search(xpath)
          end.flatten
        end

        def manifest_parsed
          yaml_parsed context.abs(manifest_path)
        end

        def manifest
          context.read(manifest_path)
        end

        def manifest_path
          context.rel_path_for_file "manifest", %w(yml yaml)
        end

        def source_dir_path
          context.rel(context.source_root)
        end

        def source_path_for_file(file)
          File.join(source_dir_path, file)
        end

        def external_sources
          source_map.select { |source| context.url? source["source_path"] }
        end

        def update_sources_and_toc(original_path, new_path)
          update_source_map original_path, new_path
          transform_toc_item original_path, new_path
        end

        def update_source_map(original_path, new_path)
          item = source_map.detect do |source|
            source["source_path"] == original_path
          end
          return false unless item.present?

          item["source_path"] = new_path
        end

        def transform_toc_item(original_path, new_path, toc_items = toc)
          item = toc_items.detect do |source|
            break source if source["source_path"] == original_path

            if source["children"].present?
              transform_toc_item original_path, new_path, source["children"]
            end
          end
          return false unless item.present?

          item["source_path"] = new_path
        end

        protected

        def build_source_map(array = toc)
          out = []
          array.each do |entry|
            out << {
              label: entry["label"],
              source_path: entry["source_path"]
            }.with_indifferent_access

            out << build_source_map(entry["children"]) if entry["children"].present?
          end

          out.flatten
        end

        def file_parsed(file_path)
          Nokogiri::HTML(context.read(file_path), nil)
        end

        def yaml_parsed(file_path)
          YAML.load_file file_path
        end
      end
    end
  end
end
