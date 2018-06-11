module Ingestions
  module Strategy
    module Document
      class Inspector

        attr_reader :ingestion, :context

        def initialize(context)
          @context = context
          @ingestion = context.ingestion
        end

        def unique_id
          Digest::MD5.hexdigest(index)
        end

        def title
          dublin_core_metadata("dc.title") ||
            first_tag_content("title") ||
            context.basename.titleize
        end

        def language
          dublin_core_metadata("dc.language") ||
            first_tag_attribute_value("html", "lang")
        end

        def date
          dublin_core_metadata("dc.date") ||
            index_parsed.at("//meta[@name=\"date\"]")&.attribute("content")&.value
        end

        def rights
          dublin_core_metadata("dc.rights")
        end

        def description
          dublin_core_metadata("dc.description")
        end

        def contributors
          index_parsed.xpath("//meta[@name=\"dc.contributor\"]")
                      .map { |node| node&.attribute("content")&.value }
                      .reject(&:nil?)
        end

        def creators
          index_parsed.xpath("//meta[@name=\"dc.creator\"]")
                      .map { |node| node&.attribute("content")&.value }
                      .reject(&:nil?)
        end

        def index_node_for(identifier)
          index_parsed.at_css(identifier)
        end

        def index
          context.read(index_path)
        end

        def index_path
          File.join("build", basename)
        end

        def index_parsed
          file_parsed index_path
        end

        def first_tag_content(tag)
          return unless index_path.present?
          index_parsed.at("//#{tag}")&.content
        end

        def dublin_core_metadata(name)
          return unless index_path.present?
          index_parsed.at("//meta[@name=\"#{name}\"]")&.attribute("content")&.value
        end

        def non_stylesheet_sources
          context.sources.reject { |source| File.extname(source).delete(".") == "css" }
        end

        def source
          non_stylesheet_sources.first
        end

        def basename
          context.basename(source)
        end

        def style_nodes
          xpath = "//*[@rel=\"stylesheet\" or @media=\"all\" or @media=\"screen\"] |
                    //style"
          index_parsed.search(xpath)
        end

        def source_dir_path
          context.rel(context.source_root)
        end

        def source_path_for_file(file)
          File.join(source_dir_path, file)
        end

        protected

        def file_parsed(file_path)
          Nokogiri::HTML(context.read(file_path), nil)
        end

        def first_tag_attribute_value(tag, attribute)
          index_parsed.at("//#{tag}")&.attribute(attribute)&.value
        end
      end
    end
  end
end
