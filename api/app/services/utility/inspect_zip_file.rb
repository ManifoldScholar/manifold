module Utility
  # Given a zip file, inspect it and return a list of entries with their respective sizes.
  class InspectZipFile < ActiveInteraction::Base
    string :path

    validates :path, presence: true

    validate :path_exists!

    # @return [<Hash>]
    def execute
      [].tap do |a|
        Zip::File.open(path) do |zip_file|
          zip_file.each_entry do |entry|
            next unless entry.file?

            a << hashify(entry)
          end
        end
      end
    rescue Zip::Error => e
      errors.add :base, "Archive at #{path.inspect} could not be inspected: #{e.message}"
    end

    private

    # @param [Zip::Entry] entry
    # @return [Hash]
    def hashify(entry)
      {}.tap do |h|
        h[:name] = entry.name
        h[:size] = entry.size
      end
    end

    # @return [void]
    def path_exists!
      errors.add :path, "does not exist" unless File.exist?(path)
    end
  end
end
