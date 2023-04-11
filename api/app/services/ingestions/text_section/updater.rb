module Ingestions
  module TextSection
    class Updater < Ingestions::AbstractInteraction

      hash :manifest, strip: false
      object :text
      string :text_section_id
      hash :attributes do
        string :build
        string :source_identifier
        string :name, default: "untitled"
        string :kind
        array :stylesheet_contents
      end

      def execute
        update_or_create
        report

        text_section
      end

      private

      def text_section
        @text_section ||= initialize_text_section
      end

      def update_or_create
        text_section.update! adjusted_attributes
      end

      def initialize_text_section
        return text.text_sections.find(text_section_id) if text_section_id.present?

        text.text_sections.find_or_initialize_by(
          source_identifier: attributes[:source_identifier], position: position
        )
      end

      def adjusted_attributes
        attributes.clone.tap do |hash|
          hash[:text] = text
          hash[:ingestion_source] = ingestion_source
          hash[:source_body] = source_body
          hash[:stylesheets] = user_stylesheets + stylesheets
        end.except(:build, :stylesheet_contents)
      end

      def position
        return text_section.position if text_section_id.present?

        text.text_sections.count + 1
      end

      def source_body
        context.read(attributes[:build])
      end

      def ingestion_source
        text.ingestion_sources.find_by(source_identifier: attributes[:source_identifier])
      end

      def user_stylesheets
        text_section.stylesheets.where(ingested: false)
      end

      def stylesheets
        text.stylesheets.where(hashed_content: attributes[:stylesheet_contents])
      end

      def report
        key = if text_section.id_previously_changed?
                "services.ingestions.compiler.text_section.log.new"
              else
                "services.ingestions.compiler.text_section.log.updated"
              end

        info key, name: text_section.name
      end
    end
  end
end
