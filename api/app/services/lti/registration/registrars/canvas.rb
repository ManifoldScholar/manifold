# frozen_string_literal: true

module Lti
  module Registration
    module Registrars
      # Canvas-specific registrar. Injects the Canvas placement vocabulary and the
      # Canvas message extensions that the LTI-core base registrar omits.
      class Canvas < Registrar
        PRODUCT_FAMILY_CODE = "canvas"

        RESOURCE_LINK_PLACEMENTS = %w[link_selection course_navigation].freeze
        DEEP_LINKING_PLACEMENTS  = %w[
          link_selection
          editor_button
          assignment_selection
          course_assignments_menu
          module_index_menu_modal
        ].freeze

        # Canvas sizes the deep linking selection modal from these message-level
        # extensions (pixels). Dynamic registration does not honor the per-placement
        # selection_width/selection_height of the manual JSON config, only launch_*.
        # Canvas may clamp to its own min/max.
        LAUNCH_WIDTH_KEY    = "https://canvas.instructure.com/lti/launch_width"
        LAUNCH_HEIGHT_KEY   = "https://canvas.instructure.com/lti/launch_height"
        DL_SELECTION_WIDTH  = 1920
        DL_SELECTION_HEIGHT = 1080

        private

        def message_placements(type)
          case type
          when "LtiResourceLinkRequest" then { placements: RESOURCE_LINK_PLACEMENTS }
          when DL_MESSAGE_TYPE          then { placements: DEEP_LINKING_PLACEMENTS }
          else {}
          end
        end

        def message_extensions(type)
          return {} unless type == DL_MESSAGE_TYPE

          { LAUNCH_WIDTH_KEY => DL_SELECTION_WIDTH, LAUNCH_HEIGHT_KEY => DL_SELECTION_HEIGHT }
        end
      end
    end
  end
end
