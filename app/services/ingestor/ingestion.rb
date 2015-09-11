module Ingestor

  class IngestionFailed < StandardError; end

  class Ingestion

    attr_accessor :basename, :source_path, :logger, :basename, :extension, :text

    def initialize(path, text = nil)
      @text ||= Text.create
      @source_path = path
      @basename = File.basename(path)
      @extension = File.extname(@basename).split('.').last
      @logger = Ingestor.logger
    end

  end
end