module Packaging
  module BagItSpec
    module Resources
      class AttachmentNameParser
        extend Dry::Core::Cache

        DIRECT = %i[attachment high_res translation transcript].freeze

        # @param [Symbol] name
        # @return [<String>]
        def call(name)
          name = Types::Strict::Symbol[name]

          fetch_or_store name do
            parse name
          end
        end

        private

        # @param [Symbol] name
        # @return [<String>]
        def parse(name)
          case name
          when :variant_format_one then %w[variants formats 01]
          when :variant_format_two then %w[variants formats 02]
          when :variant_poster then %w[variants poster]
          when :variant_thumbnail then %w[variants thumbnail]
          when *DIRECT then [name.to_s]
          else
            raise ArgumentError, "Unknown resource attachment name: #{name}"
          end
        end
      end
    end
  end
end
