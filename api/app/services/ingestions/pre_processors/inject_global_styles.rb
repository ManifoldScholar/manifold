module Ingestions
  module PreProcessors
    class InjectGlobalStyles < AbstractInteraction
      hash :manifest, strip: false

      # rubocop:disable Metrics/AbcSize
      def execute
        return manifest unless global_styles?

        manifest[:relationships][:stylesheets] ||= []
        manifest[:relationships][:stylesheets] << global_stylesheet

        manifest[:relationships][:text_sections].each do |ts|
          ts[:stylesheet_contents] ||= []
          ts[:stylesheet_contents].push hashed_content
        end

        manifest
      end
      # rubocop:enable Metrics/AbcSize

      private

      def existing_stylesheet_count
        manifest[:relationships][:stylesheets].length
      end

      def global_styles?
        global_styles.present?
      end

      def global_stylesheet
        {}.with_indifferent_access.tap do |hash|
          hash[:name] = "Global Styles"
          hash[:position] = existing_stylesheet_count + 1
          hash[:ingested] = false
          hash[:hashed_content] = hashed_content
          hash[:build] = write_file
          hash[:source_identifier] = "global-styles"
        end
      end

      def global_styles
        Settings.instance.ingestion[:global_styles]
      end

      def hashed_content
        @hashed_content ||= Digest::MD5.hexdigest(global_styles)
      end

      def write_file
        context.write_build_file "global-styles.css", global_styles
      end

    end
  end
end
