module Ingestions
  module Concerns
    module Loggable
      def the_logger
        @logger || logger
      end

      def significant(key, vars = {})
        msg = I18n.t(key, vars)
        the_logger.info(msg.green)
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

      def log_structure(branch, preface, indent = 0)
        branch.each do |leaf|
          # rubocop:disable Metrics/LineLength
          debug_string "#{preface}#{indent.positive? ? (' ' * indent + '|') + '-' : ''} #{leaf[:label] || 'NULL'} [#{leaf[:id]}]" if leaf[:id]
          # rubocop:enable Metrics/LineLength
          log_structure(leaf[:children], preface, indent + 2) if leaf[:children]
        end
      end
    end
  end
end
