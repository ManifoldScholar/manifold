module Ingestor
  # The <tt>Ingestion</tt> class represents a single text ingestion run. It stores the
  # ingestion text, source_path, basename, extension, and a logger instance. It has no
  # functionality of its own, rather it simplifies sharing information about the current
  # ingestion between the various classes that make up an ingestion strategy.
  #
  # @author Zach Davis
  class Ingestion
    attr_accessor :basename, :source_path, :logger, :extension, :text

    def initialize(path, _text = nil)
      @text ||= Text.create
      @source_path = path
      @basename = File.basename(path)
      @extension = File.extname(@basename).split(".").last
      @logger = Ingestor.logger
    end
  end
end
