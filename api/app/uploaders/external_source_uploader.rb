class ExternalSourceUploader < Shrine
  include Concerns::SharedUploader

  plugin :add_metadata
  plugin :determine_mime_type, analyzer: :marcel
  plugin :module_include
  plugin :moving
  plugin :validation_helpers

  add_metadata :sha256 do |io, context|
    calculate_signature(io, :sha256, format: :hex) if context[:action] == :cache
  end
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

end
