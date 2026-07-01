# frozen_string_literal: true

module Lti
  module Registration
    module Registrars
      # Blackboard Learn (Anthology) registers with core LTI via dynamic
      # registration: placements are configured at deployment time and it exposes no
      # registration-level sizing extension, so it needs no overrides.
      class Blackboard < Registrar
        PRODUCT_FAMILY_CODE = "BlackboardLearn"
      end
    end
  end
end
