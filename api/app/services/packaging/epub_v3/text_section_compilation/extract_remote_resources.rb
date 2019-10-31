module Packaging
  module EpubV3
    module TextSectionCompilation
      # Extract {Stylesheet} resources into {Packaging::EpubV3::StylesheetItem wrapped proxies}.
      class ExtractRemoteResources
        include Dry::Transaction::Operation

        # @param [Hash] state
        # @option state [TextSection] :text_section
        # @return [<Packaging::EpubV3::RemoteResourceItem>]
        def call(state)
          [].tap do |resources|
            resources.concat state[:stylesheets].flat_map(&:remote_resources)

            resources.concat state[:referenced_items].map(&:to_remote_resource).compact
          end
        end
      end
    end
  end
end
