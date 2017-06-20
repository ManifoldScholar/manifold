module Ingestor
  # Logging mixin for ingestion classes with an @logger attribute
  module Loggable
    def significant(key, vars = {})
      msg = I18n.t(key, vars)
      the_logger.info(msg.green)
    end

    def the_logger
      @logger || logger
    end

    def info(key, vars = {})
      msg = I18n.t(key, vars)
      the_logger.info(msg.yellow)
    end

    def debug_string(msg)
      the_logger.debug(msg.light_cyan)
    end

    def debug(key, vars = {})
      msg = I18n.t(key, vars)
      the_logger.debug(msg.light_cyan)
    end

    def error(key, vars = {})
      msg = I18n.t(key, vars)
      the_logger.error(msg.red)
    end

    def error_string(msg)
      the_logger.error(msg.red)
    end

    def warn(key, vars = {})
      msg = I18n.t(key, vars)
      the_logger.warn(msg.light_red)
    end
  end
end
