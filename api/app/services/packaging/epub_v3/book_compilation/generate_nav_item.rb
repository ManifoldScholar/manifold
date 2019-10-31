module Packaging
  module EpubV3
    module BookCompilation
      # @see Packaging::EpubV3::NavContentGenerator
      class GenerateNavItem
        include Packaging::PipelineOperation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [void]
        def call(context)
          context.with! :book, :namespace_set do |book, namespace_set|
            compile_nav_item! book, namespace_set
          end
        end

        # @param [GEPUB::Book] book
        # @param [HTMLNodes::NamespaceSet] namespace_set
        # @return [Dry::Monads::Result]
        def compile_nav_item!(book, namespace_set)
          generator = Packaging::EpubV3::NavContentGenerator.new book, namespace_set: namespace_set

          generator.call do |m|
            m.success do |builder|
              add_nav_item! book, builder
            end

            m.failure do |code, reason|
              Failure([code, reason])
            end
          end
        end

        # @param [GEPUB::Book] book
        # @param [Nokogiri::XML::Builder] builder
        # @return [void]
        def add_nav_item!(book, builder)
          content = builder.to_xml encoding: "utf-8"

          item = book.add_item("nav.xhtml", id: "nav")

          item.add_content StringIO.new content

          item.add_property "nav"
        end
      end
    end
  end
end
