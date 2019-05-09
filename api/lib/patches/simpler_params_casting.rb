module Patches
  module SimplerParamsCasting
    # @return [Hash]
    def to_hash
      to_unsafe_h
    end    
  end
end

ActionController::Parameters.prepend Patches::SimplerParamsCasting
