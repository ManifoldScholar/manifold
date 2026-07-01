# frozen_string_literal: true

module Lti
  module Registration
    module Registrars
      # Moodle registers with core LTI only: it surfaces tools by message type
      # (External Tool activity + deep linking) and configures placements site-side,
      # so it needs no placement or message-extension overrides.
      class Moodle < Registrar
        PRODUCT_FAMILY_CODE = "moodle"
      end
    end
  end
end
