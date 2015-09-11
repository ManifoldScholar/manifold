module Ingestor
  module Strategy
    class Base
      class << self

        def copy_source_to_tmp(source_path, source_basename, logger = nil)
          tmp_source_dir = Dir.mktmpdir
          logger.info("Created tmp dir #{tmp_source_dir}") if logger
          contents = File.read(source_path)
          tmp_source_path = "#{tmp_source_dir}/#{source_basename}"
          File.open(tmp_source_path, 'w') do |file|
            logger.debug("Copied source file to #{tmp_source_path}") if logger
          end
          return tmp_source_path
        end

      end
    end
  end
end