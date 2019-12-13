module Packaging
  module BagItSpec
    module Entries
      # A simple string-based entry
      class Simple < Base
        param :content, Types::Coercible::String

        option :strip, Types::Bool, default: proc { true }

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
          content.tap do |s|
            break s.strip if strip
          end
        end
      end
    end
  end
end
