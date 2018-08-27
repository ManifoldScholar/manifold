require "securerandom"

class Seed
  # rubocop:disable Metrics/MethodLength
  def self.execute(logger = nil)
    logger ||= Logger.new(STDOUT)
    maybe_update_settings(logger)
    _anonymous_user = make_anonymous_user(logger)
    cli_user = make_cli_user(logger)
    make_feature(logger, cli_user)
    upgrade_system(logger)
  end

  def self.make_feature(logger, creator)
    return if Feature.exists?
    logger.info("Creating placeholder feature".green)
    # rubocop:disable Metrics/LineLength
    Feature.create(
      header: "Welcome to Manifold. An Intuitive, collaborative, open-source platform for scholarly publishing",
      body: "With iterative texts, powerful annotation tools, rich media support, and robust community dialogue, Manifold transforms scholarly publications into living digital works.",
      link_text: "Learn More",
      link_url: "http://manifold.umn.edu/",
      style: "dark",
      foreground_position: "absolute",
      foreground: File.open(Rails.root.join("app", "assets", "images", "seed-feature-foreground.png")),
      creator: creator,
      foreground_top: "1.9em",
      live: true
    )
    # rubocop:enable Metrics/LineLength
  end

  def self.maybe_update_settings(logger)
    logger.info("Potentially updating settings from the environment".green)
    Settings.potentially_update_from_environment!
  end

  def self.make_anonymous_user(logger)
    make_system_user(logger, :anonymous)
  end

  def self.make_cli_user(logger)
    make_system_user(logger, :command_line)
  end

  def self.upgrade_system(logger)
    SystemUpgrades::Perform.run force: false, noop: true, stdout: true
    logger.info("Running system upgrades".green)
  end

  # @api private
  def self.make_system_user(logger, classification)
    classification = UserClassification.fetch(classification)

    User.fetch_by_classification(classification.to_s) do |created, user|
      if created
        logger.info "Creating #{classification.text} user: #{user.email}".green
      else
        logger.info "#{classification.text} user exists: #{user.id}".green
      end
    end
  end

  # rubocop:enable Metrics/MethodLength
end
