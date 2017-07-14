module Ingestor
  module Preprocessor
    module HTML
      class Processor

        def self.run!(source_path)
          contents = nil
          File.open(source_path, "r") do |file|
            contents = file.read
            contents = InlineStyles.new.run(contents)
          end
          File.open(source_path, "w+") do |file|
            file.write(contents)
          end
        end

      end
    end
  end
end
