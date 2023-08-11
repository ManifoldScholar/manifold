module Patches
  module ForShrine
    module AllowAdditionalMetadataToBeSet
      extend ActiveSupport::Concern
      extend ActiveSupport::Configurable

      included do
        attr_writer :original_filename
        attr_accessor :alt_text
      end
    end
  end
end

Shrine.plugin :data_uri
Shrine::DataFile.include Patches::ForShrine::AllowAdditionalMetadataToBeSet
