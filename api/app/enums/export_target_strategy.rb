class ExportTargetStrategy < ClassyEnum::Base
  config.disabled = false

  def disabled?
    config.disabled.present?
  end

  def enabled?
    !disabled?
  end

  class << self
    def disable!
      config.disabled = true
    end

    # @return [<String>]
    def enabled
      each_with_object([]) do |enum, a|
        next unless enum.enabled?

        value = block_given? ? yield(enum) : enum

        a << value
      end
    end

    def enabled?(strategy)
      strategy.in? enabled
    end
  end
end

# @note For future use
class ExportTargetStrategy::S3 < ExportTargetStrategy
  disable!
end

# Describes an {ExportTarget} that uses SFTP
# along with an RSA key as its strategy.
class ExportTargetStrategy::SFTPKey < ExportTargetStrategy
end

# Describes an {ExportTarget} that uses SFTP
# along with a username and password combination
# as its strategy.
class ExportTargetStrategy::SFTPPassword < ExportTargetStrategy
end

# A fallback for unknown {ExportTarget} strategies
class ExportTargetStrategy::Unknown < ExportTargetStrategy
  disable!
end
