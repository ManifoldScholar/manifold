module Utility
  class InspectModel
    def call(model)
      case model
      when ApplicationRecord
        "#{model.model_name}(#{model.id.inspect})"
      when Types.Interface(:model_name)
        model.model_name.to_s
      else
        model.inspect
      end
    end
  end
end
