module Updaters
  module Meta
    class GetAttachment < ActiveInteraction::Base
      string :data, default: nil
      string :filename, default: nil

      # @return [Shrine::Plugins::DataUri::DataFile, nil]
      def execute
        return nil unless data.present? && filename.present?

        Shrine.data_uri(data).tap do |data_file|
          data_file.original_filename = filename
        end
      rescue ::Shrine::Plugins::DataUri::ParseError
        nil
      end
    end
  end
end
