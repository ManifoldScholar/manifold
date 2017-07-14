module Ingestor
  module Preprocessor
    module HTML
      class << self
        def process!(*args)
          ::Ingestor::Preprocessor::HTML::Processor.run!(*args)
        end
      end
    end
  end
end
