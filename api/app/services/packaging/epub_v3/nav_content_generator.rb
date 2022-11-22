module Packaging
  module EpubV3
    # A rewrite of `GEPUB::Book#nav_doc` to better support our use cases. Namely, including
    # the correct epub:prefix values and other XML namespaces.
    class NavContentGenerator
      extend Dry::Initializer
      extend Memoist

      include Dry::Matcher::ResultMatcher.for(:call)
      include Dry::Monads[:result]

      param :book, Types.Instance(GEPUB::Book)

      option :namespace_set, HTMLNodes::NamespaceSet, default: proc { HTMLNodes::NamespaceSet.new }
      option :title, Types::String, default: proc { "Table of Contents" }

      # @return [Nokogiri::XML::Builder]
      def call
        builder = Nokogiri::XML::Builder.new do |doc|
          doc.html(namespace_set.to_nokogiri) do
            doc.head do
              doc.title title
            end

            doc.body do
              write_table_of_contents! doc

              write_landmarks! doc
            end
          end
        end

        Success(builder)
      end

      # @return [Hash]
      memoize def stacked_toc
        # handle cascaded toc
        start_level = book_toc.dig(0, :level) || 1

        stacked_toc = { level: start_level, tocs: [] }

        book_toc.reduce stacked_toc do |current_stack, toc_entry|
          toc_entry_level = toc_entry[:level] || 1

          if current_stack[:level] < toc_entry_level
            new_stack = { level: toc_entry_level, tocs: [], parent: current_stack }

            current_stack[:tocs].last[:child_stack] = new_stack

            current_stack = new_stack
          else
            current_stack = current_stack[:parent] while current_stack[:level] > toc_entry_level && current_stack[:parent].present?
          end

          current_stack[:tocs].push toc_entry

          current_stack
        end

        return stacked_toc
      end

      memoize def book_landmarks
        Array(book.instance_variable_get(:@landmarks))
      end

      memoize def book_toc
        Array(book.instance_variable_get(:@toc))
      end

      # @param [Nokogiri::XML::Builder] builder
      # @param [<Hash>] tocs
      # @return [void]
      def write_table_of_contents!(builder)
        return unless stacked_toc.present?

        builder.nav("epub:type" => "toc", "id" => "toc") do
          builder.h1 title

          recur_table_of_contents! builder, stacked_toc[:tocs]
        end
      end

      # @param [Nokogiri::XML::Builder] builder
      # @param [<Hash>] tocs
      # @return [void]
      def recur_table_of_contents!(builder, tocs)
        return if tocs.blank?

        builder.ol do
          tocs.each do |x|
            id = x[:id].nil? ? "" : "##{x[:id]}"

            toc_text = x[:text].presence || x[:item].href

            builder.li do
              builder.a({ "href" => x[:item].href + id }, toc_text)

              child_tocs = x.dig(:child_stack, :tocs)

              recur_table_of_contents! builder, child_tocs if child_tocs.present?
            end
          end
        end
      end

      # @param [Nokogiri::XML::Builder] builder
      # @return [void]
      def write_landmarks!(builder)
        return unless book_landmarks.present?

        builder.nav("epub:type" => "landmarks", "id" => "landmarks") do
          builder.ol do
            book_landmarks.each do |landmark|
              id = landmark[:id].nil? ? "" : "##{x[:id]}"

              builder.li do
                builder.a({ "href" => landmark[:item].href + id, "epub:type" => landmark[:type] }, landmark[:title])
              end
            end
          end
        end
      end
    end
  end
end
