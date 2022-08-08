module Attachments
  class Configuration < Types::FlexibleStruct
    attribute :field, Types::ATTRIBUTE_NAME
    attribute :type, Types::ATTACHMENT_TYPE
    attribute :no_styles, Types::Bool.default(false)
    attribute :backgrounding, Types::Bool.default(true)
    attribute :validate_content_type, Types::Bool.default(true)

    attribute :validations, Types::FlexibleStruct do
      attribute :allowed_mime, Types::Array.of(Types::String)
      attribute :allowed_ext, Types::Array.of(Types::String)
    end

    def has_versions?
      !no_styles
    end

    # @!attribute [r] options
    # @return [{ Symbol => Boolean, Symbol }]
    memoize def options
      to_h.slice(:type, :no_styles, :validate_content_type)
    end
  end
end
