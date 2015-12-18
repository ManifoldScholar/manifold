module Ingestor
  # Logging mixin for ingestion classes with an @logger attribute
  module Loggable

    def significant(key, vars = {})
      msg = I18n.t(key, vars)
      @logger.info(msg.green)
    end

    def info(key, vars = {})
      msg = I18n.t(key, vars)
      @logger.info(msg.yellow)
    end

    def debug_string(msg)
      @logger.debug(msg.light_cyan)
    end

    def debug(key, vars = {})
      msg = I18n.t(key, vars)
      @logger.debug(msg.light_cyan)
    end

    def error(key, vars = {})
      msg = I18n.t(key, vars)
      @logger.error(msg.red)
    end

    def warn(key, vars = {})
      msg = I18n.t(key, vars)
      @logger.warn(msg.orange)
    end
  end
end
