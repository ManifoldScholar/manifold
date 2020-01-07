require "sftp_server"
require "tmpdir"

module TestSFTP
  ROOT = Pathname.new(__dir__).freeze

  AUTHORIZED_KEYS_PATH = ROOT.join("authorized_keys").freeze

  HOST_KEY_TYPES = %i[dsa ecdsa ed25519 rsa].freeze

  HOST_KEYS = HOST_KEY_TYPES.each_with_object({}.with_indifferent_access) do |type, h|
    h[type] = ROOT.join("ssh_host_#{type}_key")
  end.freeze

  PRIVATE_KEY = ROOT.join("test_rsa")
  PUBLIC_KEY  = ROOT.join("test_rsa.pub")

  TMP_DIR = %w[sftp- -cache].freeze

  module AuthPatch
    MAX_LOOPS = 10

    def authenticate(session)
      authenticated = false

      loop_count = 0

      while !authenticated
        message = SFTPServer::SSH::API.ssh_message_get(session)
        next unless message

        message_type = SFTPServer::SSH::API.ssh_message_type(message)

        loop_count += 1 if message_type == -1

        if loop_count >= MAX_LOOPS
          log "message_type: #{message_type} loop count exceeded: #{loop_count}"

          break
        end

        log "message_type: #{message_type}"
        next unless message_type > -1

        case message_type
        when SFTPServer::SSH::API::MessageTypes::SSH_REQUEST_AUTH
          log "auth"
          message_subtype = SFTPServer::SSH::API.ssh_message_subtype(message)
          log "auth message_subtype: #{message_subtype}"
          case message_subtype
          when SFTPServer::SSH::API::MessageAuthTypes::SSH_AUTH_METHOD_PASSWORD
            request_user_name = SFTPServer::SSH::API.ssh_message_auth_user(message)
            request_password = SFTPServer::SSH::API.ssh_message_auth_password(message)
            log user_name
            log password
            if user_name == request_user_name && password == request_password
              SFTPServer::SSH::API.ssh_message_auth_reply_success(message, 0)
              SFTPServer::SSH::API.ssh_message_free(message)
              authenticated = true
              break
            else
              SFTPServer::SSH::API.ssh_message_reply_default(message)
              next
            end
          else
            respond_auth_required(message) unless @authenticated
          end
        else
          SFTPServer::SSH::API.ssh_message_reply_default(message)
        end
      end

      authenticated
    end
  end

  class Instance
    extend Dry::Initializer

    param :server_pid
    param :directory

    option :dsa_key, Dry::Types["coercible.string"]
    option :rsa_key, Dry::Types["coercible.string"]
    option :port, Dry::Types["coercible.string"]
    option :user_name, Dry::Types["coercible.string"]
    option :password, Dry::Types["coercible.string"]
    option :listen_address, Dry::Types["coercible.string"]
    option :authorized_keys_file, Dry::Types["coercible.string"]
    option :authorized_keys, Dry::Types["coercible.string"]

    alias username user_name
    alias host listen_address

    def connect_command
      "sftp -v -P #{port} #{username}@#{connection_host}"
    end

    def connection_host
      case listen_address
      when "0.0.0.0" then "127.0.0.1"
      else
        listen_address
      end
    end
  end

  class Server
    extend Dry::Configurable

    setting(:dsa_key, HOST_KEYS[:dsa], reader: true) { |v| Pathname.new v }
    setting(:rsa_key, HOST_KEYS[:rsa], reader: true) { |v| Pathname.new v }
    setting(:port, "2299", reader: true) { |v| v.to_s }
    setting(:user_name, "test", reader: true)
    setting(:password, "test", reader: true)
    setting(:listen_address, "0.0.0.0", reader: true)
    setting(:authorized_keys_file, AUTHORIZED_KEYS_PATH, reader: true) { |v| Pathname.new v }
    setting(:authorized_keys, PUBLIC_KEY.read, reader: true)

    class << self
      # Fork a process, create a temporary directory, `chdir` into said temporary directory,
      # and start a SFTP server within it.
      #
      # It returns the pid so that the parent process can wait or kill it as necessary.
      #
      # @param [String, nil] tmp_root the root directory to make the temporary directory within
      #   (see `Dir.mktmpdir` in ruby docs)
      # @return [Integer] the pid of the child process
      def fork_start!(tmp_root: nil, **options)
        reader, writer = IO.pipe

        configuration = to_configuration options

        server_pid = fork do
          reader.close

          Dir.mktmpdir TMP_DIR, tmp_root do |dir|
            writer.write dir
            writer.close

            Dir.chdir dir do
              begin
                server = ::SFTPServer::Server.new configuration

                server.open
              rescue Interrupt
                exit 0
              end
            end
          end
        end

        writer.close

        directory = reader.read

        reader.close

        Instance.new server_pid, directory, configuration
      end

      # @return [{ Symbol => Object }]
      def to_configuration(**options)
        {
          authorized_keys: authorized_keys,
          authorized_keys_file: authorized_keys_file.to_s,
          dsa_key: dsa_key.to_s,
          rsa_key: rsa_key.to_s,
          port: port,
          user_name: user_name,
          password: password,
          listen_address: listen_address
        }.merge(options).transform_values(&:to_s)
      end
    end
  end
end

SFTPServer::Server.prepend TestSFTP::AuthPatch
