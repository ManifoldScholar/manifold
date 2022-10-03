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
          return nil unless toc_start_section_item.present?

          Digest::MD5.hexdigest context.basename(base_source_path(toc_start_section_item["source_path"]))
        end

        def toc_start_section_item(items = toc)
          @toc_start_section_item ||= begin
            items.each do |item|
              return item if item["start_section"].present?
              return toc_start_section_item(item["children"]) if item["children"].present?
            end

            nil
          end
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
            rel_path = context.rel_path_without_ext source
            path = File.join "build", "#{rel_path}.html"
            file_parsed(path).search(xpath)
          end.flatten
        end

        def manifest_parsed
          yaml_parsed context.abs(manifest_path)
        end

        def manifest
          context.read(manifest_path)
        end

        def manifest_path
          context.rel_path_for_file "*", %w(yml yaml)
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

        def update_source_map(original_path, new_path)
          item = source_map.detect do |source|
            source["source_path"] == original_path
          end
          return false unless item.present?

          item["remote_source_path"] = item["source_path"]
          item["source_path"] = new_path
        end

        # Called after remote files have been fetched. Updates TOC to point at the
        # fetched HTML file instead of the remote url.
        def update_toc
          @toc = update_toc_entries(toc)
        end

        def update_toc_entries(entries)
          entries.map do |entry|
            update_toc_entry(entry)
          end
        end

        def update_toc_entry(entry)
          sm_entry = source_map.detect do |compare|
            compare[:remote_source_path] == base_source_path(entry["source_path"])
          end
          entry["source_path"] = sm_entry[:source_path] if sm_entry
          entry["children"] = update_toc_entries(entry["children"]) if entry["children"]
          entry
        end

        protected

        # This is where we filter out duplicate sources.  A source is considered a duplicate
        # if its source path references the same file.  We only accept the first reference (in TOC order)
        # of a source file.
        def build_source_map(array = toc, out = [])
          array.each do |entry|
            out << build_source_map_item(entry) unless source_in_sources?(entry, out)
            out = build_source_map(entry["children"], out) if entry["children"].present?
          end
          out
        end

        def build_source_map_item(entry)
          { label: entry["label"], source_path: base_source_path(entry["source_path"]) }.with_indifferent_access
        end

        def source_in_sources?(source, sources)
          base_path = base_source_path(source["source_path"])

          sources.flatten.any? { |ex_source| ex_source["source_path"] == base_path }
        end

        def base_source_path(path)
          path.partition("#").first
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
