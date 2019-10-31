module Packaging
  module EpubV3
    class BookContext < Types::FlexibleStruct
      attribute :book, Types.Instance(GEPUB::Book)
      attribute :compiled_text, Packaging::EpubV3::CompiledText

      delegate :namespace_set, :package_context, :text, :text_id, to: :compiled_text
      delegate :temporary_directory, to: :package_context

      # @!attribute [r] epub_name
      # @return [String]
      def epub_name
        "#{text.id}.epub"
      end

      # @!attribute [r] epub_path
      # @return [Pathname]
      memoize def epub_path
        Pathname.new(File.join(temporary_directory, epub_name))
      end

      # @param [<Symbol>] components names of components to extract and provide to a block
      # @yieldparam [<Object>] values of the provided component names
      # @return [self] Chainable
      def with!(*components)
        component_values = components.map do |component_name|
          public_send(component_name)
        end

        yield(*component_values) if block_given?

        return self
      end
    end
  end
end
