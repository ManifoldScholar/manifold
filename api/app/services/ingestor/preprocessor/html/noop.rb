module Ingestor
  module Preprocessor
    module HTML
      # This class is here to illustrate how we might add additional preprocessors
      # as part of the general HTML preprocessing.
      class Noop

        def run(markup)
          markup
        end

      end
    end
  end
end
