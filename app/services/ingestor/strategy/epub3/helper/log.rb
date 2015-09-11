require 'naught'

module Ingestor
  module Strategy
    module EPUB3
      module Helper
        class Log

          def self.log_structure(s, preface, logger)
            self.log_structure_recursive(s, preface, logger)
          end

          private

          def self.log_structure_recursive(branch, preface, logger, indent = 0)
            branch.each do |leaf|
              logger.debug "#{preface} #{" " * indent}#{leaf[:label] || 'NULL'} #{"[#{leaf[:source_identifier]}]" if leaf[:source_identifier]}"
              if leaf[:children]
                log_structure_recursive(leaf[:children], preface, logger, indent + 2)
              end
            end
          end

        end
      end
    end
  end
end
