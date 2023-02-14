module SystemUpgrades
  class AbstractVersion < ActiveInteraction::Base
    include SystemUpgrades::HasLogger
    include SystemUpgrades::Utilities

    boolean :noop, default: false
    boolean :force, default: false
    boolean :stdout, default: false

    delegate :version, :version_string, to: :class

    set_callback :execute, :around, :tag_version!

    def execute
      unless upgrade_result.new_record?
        if force
          logger.debug "Upgrade already exists, but specified force"
        else
          logger.debug "Upgrade already exists, skipping"

          return [nil, output.string]
        end
      end
      perform! unless noop

      upgrade_result.output += output.string
      upgrade_result.save!

      [upgrade_result, output.string]
    end

    # @abstract This method gets overridden in version classes
    # @return [void]
    def perform!; end

    # @!attribute [r] upgrade_result
    # @api private
    # @return [UpgradeResult]
    def upgrade_result
      @upgrade_result ||= UpgradeResult.fetch(version_string)
    end

    private

    def tag_version!
      logger.tagged(version_string, &Proc.new)
    end

    class << self
      def version_string
        @version_string ||= name.demodulize[/(\d+)\z/, 1].scanf("%02d%02d%02d").join(".")
      end

      def version
        @version ||= Gem::Version.new(version_string)
      end
    end
  end
end
