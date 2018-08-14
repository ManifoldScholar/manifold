# Helper service for creating Ingestions through the CLI.
# Its primary use is in rake tasks where the source file is not being received as an
# upload through Tus.

module Ingestions
  class CreateManually < ActiveInteraction::Base
    object :project
    object :creator, class: "User", default: proc { User.cli_user }

    file :source

    def execute
      attributes = inputs.slice(:project, :creator)

      Shrine.storages[:store].upload(source, source_id)

      Ingestion.create! attributes do |ingestion|
        source_data = source_data_params

        shrine_source = IngestionUploader.uploaded_file(source_data)

        ingestion.source_attacher.set shrine_source
      end
    end

    private

    def source_id
      @source_id ||= File.basename(source.path)
    end

    def source_data_params
      {
        storage: :store,
        id: source_id,
        metadata: {
          filename:  source_id,
          size:      source.size,
          mime_type: Marcel::MimeType.for(source)
        }
      }.deep_stringify_keys
    end
  end
end
