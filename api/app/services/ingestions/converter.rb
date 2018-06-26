module Ingestions
  class Converter < AbstractInteraction
    string :source_path

    def execute
      converter = compose Pickers::Converter

      contents = context.read(source_path)

      compose converter.interaction, contents: contents
    end

  end
end
