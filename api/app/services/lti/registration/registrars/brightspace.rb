# frozen_string_literal: true

module Lti
  module Registration
    module Registrars
      # Brightspace (D2L) registers with core LTI only: placements are configured
      # administratively at the deployment level ("Insert Stuff" / "Quicklink") and
      # embedded content is sized via the deep linking response, so it needs no
      # placement or message-extension overrides.
      class Brightspace < Registrar
        PRODUCT_FAMILY_CODE = "desire2learn"
      end
    end
  end
end
