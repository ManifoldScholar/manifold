module Manifold
  module Rake
    def self.report_created_model(model)
      logger = Manifold::Rake.logger
      if model.valid?
        logger.info "A #{model.model_name.human} has been created. Its ID is #{model.id}"
      else
        name = model.model_name.human
        logger.info(
          "Attempting to create a #{name} produced the following errors:"
        )
        model.errors.full_messages.each do |m|
          logger.info "  - #{m}."
        end
      end
    end

    def self.cli_user
      User.cli_user
    end

    def self.logger
      logger = Logger.new($stdout)
      logger.formatter = proc { |severity, _datetime, _progname, msg|
        "#{severity.rjust(8)}: #{msg}\n"
      }
      logger
    end
  end
end
