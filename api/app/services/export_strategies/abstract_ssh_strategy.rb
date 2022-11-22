module ExportStrategies
  # @abstract
  class AbstractSSHStrategy < AbstractStrategy
    has_port! default: 22

    setting :auth_methods, default: [], reader: true, constructor: ->(value) { Array(value) }

    attribute :host, :string
    attribute :username, :string

    enum :compression, %i[none zlib], default: :none

    delegate :auth_methods, to: :class

    validates :host, :username, presence: true

    # @api private
    # @return [{ Symbol => Object }]
    def to_ssh_options
      slice(:auth_methods, :port).tap do |h|
        h[:compression] = compression
        h[:non_interactive] = true
        # h[:verbose] = :debug
      end
    end

    connection do
      # @!attribute [r] ssh_options
      # The ssh options for the current `connection` context.
      # @see #build_ssh_options
      # @return [{ Symbol => Object }]
      memoize def ssh_options
        strategy.to_ssh_options
      end

      # @note `Net::SFTP.start` does not pass through the result of the block,
      #   so we have to capture it.
      def establish_connection!
        capture one_time: true do |c|
          Net::SFTP.start strategy.host, strategy.username, ssh_options do |sftp|
            c << yield(sftp)
          end
        end
      rescue Net::SSH::AuthenticationFailed => e
        halt! e.message
      end

      # @return [void]
      def merge_ssh_options!(**new_ssh_options)
        ssh_options.merge! new_ssh_options
      end
    end

    uploader do
      alias_method :sftp, :connection

      # @api private
      def directory_exists?(path)
        sftp.lstat!(path.to_s)&.directory?
      rescue Net::SFTP::StatusException
        false
      end

      # @api private
      # @return [void]
      def mkdir_safe!(path)
        return if directory_exists? path

        sftp.mkdir! path
      rescue Net::SFTP::StatusException => e
        halt! e.message, code: :invalid_path
      end

      def upload!(payload)
        # Ensure directories exist
        payload.each_target_directory_component do |component|
          mkdir_safe! component
        end

        payload.with_local_export_source do |source|
          sftp.upload! source.path, payload.target_path
        end

        return payload
      end
    end
  end
end
