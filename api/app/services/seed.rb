require "securerandom"

class Seed
  def self.execute(logger = nil)
    logger ||= Logger.new($stdout)
    maybe_update_settings(logger)
    _anonymous_user = make_anonymous_user(logger)
    cli_user = make_cli_user(logger)
    make_feature(logger, cli_user)
  end

  def self.make_feature(logger, creator)
    return if Feature.exists?

    logger.info(Rainbow("Creating placeholder feature").lightblue)
    # rubocop:disable Layout/LineLength
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
    # rubocop:enable Layout/LineLength
  end

  def self.maybe_update_settings(logger)
    logger.info(Rainbow("Potentially updating settings from the environment").lightblue)
    Settings.potentially_update_from_environment!
  end

  def self.make_anonymous_user(logger)
    make_system_user(logger, :anonymous)
  end

  def self.make_cli_user(logger)
    make_system_user(logger, :command_line)
  end

  # @api private
  def self.make_system_user(logger, classification)
    classification = UserClassification.fetch(classification)
    begin
      User.fetch_by_classification(classification.to_s)
    rescue Faraday::ConnectionFailed
      Rails.logger.warn "Unable to index user in ElasticSearch while running seed script."
    end
    user = User.fetch_by_classification(classification.to_s)
    logger.info Rainbow("Ensuring #{classification.text} user exists: #{user.email}").lightblue
    user
  end

end
