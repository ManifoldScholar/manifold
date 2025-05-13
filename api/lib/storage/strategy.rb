# frozen_string_literal: true

module Storage
  class Strategy
    include Dry::Initializer[undefined: false].define -> do
      param :name, ::Storage::Types::StrategyName

      option :type, ::Storage::Types::StrategyType
    end

    def cloud?
      gcs? || s3?
    end

    def file?
      name == "file"
    end

    def gcs?
      name == "gcs"
    end

    def s3?
      name == "s3"
    end

    alias aws? s3?

    class << self
      # @return [Storage::Strategy, nil]
      def mirror
        env_name = ENV["MANIFOLD_SETTINGS_STORAGE_MIRROR"].presence

        name = ::Storage::Types::MirrorStrategyName[env_name]

        return if name.nil?

        new(name, type: :mirror)
      end

      # @return [Storage::Strategy]
      def primary
        env_name = ENV["MANIFOLD_SETTINGS_STORAGE_PRIMARY"].presence || "file"

        name = ::Storage::Types::PrimaryStrategyName[env_name]

        new(name, type: :primary)
      end
    end
  end
end
