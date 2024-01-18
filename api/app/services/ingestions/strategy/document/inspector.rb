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
            header_with_title_class_content ||
            original_filename ||
            File.basename(source, ".*").titleize
        end

        def header_with_title_class_content
          return unless index_path.present?

          index_parsed.at("//h1[@class=\"textTitle\"]")&.content
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

        def isbn
          index_parsed.at("//meta[@name=\"date\"]")&.attribute("content")&.value
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

        def index_source_path
          basename
        end

        def index_parsed
          @index_parsed || index_parsed_uncached
        end

        def index_parsed_uncached
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

        def convertible_sources
          convertible = Ingestions.converters.convertible_extensions
          context.sources.select do |source|
            ext = File.extname(source).delete(".")
            convertible.include?(ext)
          end
        end

        def source
          return convertible_sources.first if convertible_sources.length == 1

          convertible_sources.detect do |convertible_source|
            File.basename(convertible_source).downcase.start_with? "index."
          end
        end

        def original_filename
          return if ingestion.external_source_url.present?

          filename = ingestion.source_data.with_indifferent_access[:metadata][:filename]
          File.basename(filename, ".*").titleize
        end

        def basename
          "index.html"
        end

        def style_nodes
          xpath = "//*[@rel=\"stylesheet\" or @media=\"all\" or @media=\"screen\"] |
                    //style"
          index_parsed.search(xpath)
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
