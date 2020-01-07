module ExportStrategies
  # @see ExportTargetStrategy::SFTPKey
  class SFTPKeyStrategy < AbstractSSHStrategy
    attribute :private_key, :string

    validates :private_key, presence: true

    config.auth_methods = "publickey"

    connection do
      around_connection :with_temporary_private_key!

      after_configure :configure_private_key!

      # @return [String]
      attr_reader :temporary_private_key_path

      private

      # Merge the {#temporary_private_key_path} onto the `:keys`
      # option of {#ssh_options}.
      #
      # @return [void]
      def configure_private_key!
        ssh_options[:keys] = [temporary_private_key_path]
      end

      # Copy the {ExportStrategies::SFTPKeyStrategy#private_key} to a temporary file for use with {#configure_private_key!}.
      #
      # @return [void]
      def with_temporary_private_key!
        Tempfile.open(["id-", ".private_key"]) do |f|
          f.write strategy.private_key

          # Important! Make sure the buffers are cleared before letting it
          # be read by the SFTP process.
          f.fsync

          @temporary_private_key_path = f.path

          yield if block_given?
        end
      ensure
        @temporary_private_key_path = nil
      end
    end
  end
end
