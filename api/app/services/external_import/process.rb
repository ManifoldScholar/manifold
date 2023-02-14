module ExternalImport
  class Process < ActiveInteraction::Base
    string :source_path, default: proc { Rails.root.join("manifold-export.json").to_s }

    hash :text_mapping, strip: false

    validates :text_mapping, presence: true

    validate :texts_must_exist!

    def execute
      @source_data = JSON.parse(File.read(source_path)).with_indifferent_access

      @source_data[:users].each do |user_definition|
        compose ExternalImport::ImportUser, user_definition
      end

      @source_data[:texts].each do |text|
        text[:selections].each do |selection|
          selection_inputs = selection.tap do |h|
            h[:source_text_id] = text[:source_id]
            h[:text_id] = text_mapping.fetch(text[:source_id])
          end

          compose ExternalImport::ProcessSelection, selection_inputs
        end
      end
    end

    private

    UNKNOWN_TEXT_FMT = %(has unknown text id: "%<remote>s" => "%<local>s").freeze

    # @return [void]
    def texts_must_exist!
      text_mapping.each do |(source_text_id, local_text_id)|
        next if Text.exists? local_text_id

        message = format(
          UNKNOWN_TEXT_FMT,
          local: local_text_id,
          remote: source_text_id
        )

        errors.add :text_mapping, message
      end
    end
  end
end
