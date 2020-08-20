module Configurates
  extend ActiveSupport::Concern

  include Cleanroom

  included do
    extend ActiveModel::Callbacks

    define_model_callbacks :evaluation
  end

  def evaluate(*)
    run_callbacks :evaluation do
      super
    end
  end

  def evaluate_file(*)
    run_callbacks :evaluation do
      super
    end
  end
end
