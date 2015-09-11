require 'memoist'
require 'naught'

module Ingestor
  module Strategy
    module EPUB3
      module Transformer
        class TOCStructure

          def self.convert(input, text)
            output = {
              titles: input[:titles].clone,
              toc: self::branch_convert(input[:toc].clone, text),
              page_list: self::branch_convert(input[:page_list].clone, text),
              landmarks: self::branch_convert(input[:landmarks].clone, text)
            }
            output
          end

          private

          def self.branch_convert(branch, text)
            branch.each do |leaf|
              if leaf[:source_path]
                ts = text.find_text_section_by_source_path(leaf[:source_path])
                if ts
                  leaf[:id] = ts.id
                  leaf.delete(:source_path)
                end
              end
              if leaf[:children]
                self.branch_convert(leaf[:children], text)
              end
            end
          end

        end
      end
    end
  end
end