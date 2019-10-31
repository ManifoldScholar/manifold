class ExternalSourceUploader < Shrine
  MANIFOLD_CONFIG = Rails.configuration.manifold

  URL_OPTIONS = {
    host: MANIFOLD_CONFIG.api_url&.sub(%r{\/\z}, "") || ""
  }.freeze

  plugin :add_metadata
  plugin :determine_mime_type, analyzer: :marcel
  plugin :module_include
  plugin :moving
  plugin :validation_helpers
  plugin :default_url_options, cache: URL_OPTIONS, store: URL_OPTIONS

  add_metadata :sha256 do |io, context|
    calculate_signature(io, :sha256, format: :hex) if context[:action] == :cache
  end

  # rubocop:disable Layout/IndentHeredoc
  attachment_module do
    def included(model)
      super

      module_eval <<~RUBY, __FILE__, __LINE__ + 1
      def has_#{@name}?
        #{@name}.present?
      end

      def has_no_#{@name}?
        #{@name}.blank?
      end

      def #{@name}_file_name
        #{@name}&.original_filename
      end

      def #{@name}_path
        #{@name}&.to_io&.path
      end
      RUBY
    end
  end
  # rubocop:enable Layout/IndentHeredoc
end
