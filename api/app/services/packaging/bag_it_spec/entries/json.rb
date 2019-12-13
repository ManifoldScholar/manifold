module Packaging
  module BagItSpec
    module Entries
      # A file that contains arbitrary JSON-encoded content
      class JSON < Base
        param :content, Types.Interface(:as_json)

        def add_to!(bag)
          return if skip_blank && content.blank?

          bag.add_file target_path do |output_file|
            output_file.write content_to_write
          end
        end

        private

        # @!attribute [r] content_to_write
        # @return [String]
        memoize def content_to_write
          ::JSON.pretty_generate content.as_json
        end
      end
    end
  end
end
