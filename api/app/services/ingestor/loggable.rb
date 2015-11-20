module Ingestor
  # Logging mixin for ingestion classes with an @logger attribute
  module Loggable
    def info(key, vars = {})
      msg = I18n.t(key, vars)
      @logger.info(msg)
    end

    def debug(key, vars = {})
      msg = I18n.t(key, vars)
      @logger.debug(msg)
    end

    def error(key, vars = {})
      msg = I18n.t(key, vars)
      @logger.error(msg)
    end

    def warn(key, vars = {})
      msg = I18n.t(key, vars)
      @logger.warn(msg)
    end
  end
end
