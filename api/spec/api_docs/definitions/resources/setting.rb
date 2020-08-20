module APIDocs
  module Definitions
    module Resources
      class Setting

        REQUEST_ATTRIBUTES = {
          press_logo: Types::Serializer::Upload,
          remove_press_logo: Types::Bool,
          press_logo_footer: Types::Serializer::Upload,
          remove_press_logo_footer: Types::Bool,
          press_logo_mobile: Types::Serializer::Upload,
          remove_press_logo_mobile: Types::Bool,
          favicon: Types::Serializer::Upload,
          remove_favicon: Types::Bool,
          google_service: Types::Serializer::Upload.meta(description: "A json google service configuration file")
        }

        class << self

          include APIDocs::Definitions::Resource

          def create_attributes
            request_attributes.except(
              :remove_press_logo,
              :remove_press_logo_footer,
              :remove_press_logo_mobile,
              :remove_favicon
            )
          end

        end
      end
    end
  end
end
