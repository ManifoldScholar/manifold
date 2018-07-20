module Ingestions
  class AbstractBaseInteraction < ActiveInteraction::Base
    include Ingestions::Concerns::CatchesExceptions

    def execute; end

    private

    def compose(interaction_klass, **composed_inputs)
      super interaction_klass, composed_inputs.merge(shared_inputs)
    end

    def compose_into(target, interaction_klass, **composed_inputs)
      shared_inputs[target] = compose interaction_klass, **composed_inputs
    end

    def shared_inputs
      @shared_inputs ||= {}.merge(inputs)
    end
  end
end
