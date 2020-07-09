module Ingestions
  module Concerns
    module Loggable
      def the_logger
        @logger || logger
      end

      def significant(key, vars = {})
        msg = I18n.t(key, vars)
        the_logger.info(Rainbow(msg).green)
      end

      def info(key, vars = {})
        msg = I18n.t(key, vars)
        the_logger.info(Rainbow(msg).blue)
      end

      def debug_string(msg)
        the_logger.debug(Rainbow(msg).lightcyan)
      end

      def debug(key, vars = {})
        msg = I18n.t(key, vars)
        the_logger.debug(Rainbow(msg).lightcyan)
      end

      def error(key, vars = {})
        msg = I18n.t(key, vars)
        the_logger.error(Rainbow(msg).red)
      end

      def error_string(msg)
        the_logger.error(Rainbow(msg).red)
      end

      def warn(key, vars = {})
        msg = I18n.t(key, vars)
        the_logger.warn(Rainbow(msg).yellow)
      end

      def log_structure(branch, preface, indent = 0)
        branch.each do |leaf|
          # rubocop:disable Layout/LineLength
          debug_string "#{preface}#{indent.positive? ? (' ' * indent + '|') + '-' : ''} #{leaf[:label] || 'NULL'} [#{leaf[:id]}#{leaf[:anchor]}]" if leaf[:id]
          # rubocop:enable Layout/LineLength
          log_structure(leaf[:children], preface, indent + 2) if leaf[:children]
        end
      end
    end
  end
end
