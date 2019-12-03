module Packaging
  module EpubV3
    module BookCompilation
      # Add the compiled text's cover image, and if necessary, convert it to something usable.
      class AddCoverImage
        include Packaging::PipelineOperation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [void]
        def call(context)
          context.with!(:book, :compiled_text) do |book, compiled_text|
            next unless compiled_text.has_cover_image?

            convert_image compiled_text do |m|
              m.success do |cover_image_proxy|
                add_image_to! book, cover_image_proxy
              end

              m.failure do |(code, reason)|
                # TODO: Offer feedback / warning. Don't treat this as a failure to export the epub
              end
            end
          end
        end

        private

        def convert_image(compiled_text, &block)
          compose_monadic_interaction Packaging::EpubV3::ConvertCoverImage, compiled_text.to_convert_cover_image_inputs, &block
        end

        def add_image_to!(book, cover_image_proxy)
          item = book.add_item cover_image_proxy.path

          item.add_content cover_image_proxy.file

          item.set_media_type cover_image_proxy.content_type

          item.cover_image
        end
      end
    end
  end
end
