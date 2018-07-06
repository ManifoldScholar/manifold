module Ingestions
  class Converter < AbstractInteraction
    string :source_path

    def execute
      converter = compose Pickers::Converter

      compose converter.interaction
    end

  end
end
