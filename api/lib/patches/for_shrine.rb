module Patches
  module ForShrine
    module AllowOriginalFilenameToBeSet
      extend ActiveSupport::Concern
      extend ActiveSupport::Configurable

      included do
        attr_writer :original_filename
      end
    end
  end
end

Shrine.plugin :data_uri

# rubocop:disable Metrics/LineLength
Shrine::Plugins::DataUri::DataFile.include Patches::ForShrine::AllowOriginalFilenameToBeSet
# rubocop:enable Metrics/LineLength
