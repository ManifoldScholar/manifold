module ExportStrategies
  # @see ExportTargetStrategy::SFTPPassword
  class SFTPPasswordStrategy < AbstractSSHStrategy
    attribute :password, :string

    validates :password, presence: true

    config.auth_methods = "password"

    connection do
      after_configure :set_password!

      # @return [void]
      def set_password!
        ssh_options[:password] = strategy.password
      end
    end
  end
end
