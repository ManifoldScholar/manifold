# frozen_string_literal: true

# rubocop:disable Layout/LineLength, Metrics/MethodLength
class Seed
  extend ActiveModel::Callbacks

  # @return [User]
  attr_reader :cli_user

  # @return [Logger]
  attr_reader :logger

  define_model_callbacks :seed

  around_seed :quiet!

  def initialize(logger: nil)
    @logger = logger || Logger.new($stdout)
  end

  def call
    run_callbacks :seed do
      maybe_update_settings!

      make_system_users!

      maybe_make_placeholder_feature!
    end
  end

  private

  def quiet!
    ActiveRecord::Base.logger.silence do
      yield
    end
  end

  # @return [void]
  def maybe_update_settings!
    logger.info(Rainbow("Potentially updating settings from the environment").lightblue)

    ::Settings.potentially_update_from_environment!
  end

  # @return [void]
  def make_system_users!
    make_system_user!(:anonymous)

    make_system_user!(:deleted)

    make_system_user!(:testing)

    @cli_user = make_system_user!(:command_line)
  end

  # @param [UserClassification] classification
  # @return [User]
  def make_system_user!(classification)
    classification = UserClassification.fetch(classification)

    begin
      User.fetch_by_classification(classification.to_s)
    rescue Faraday::ConnectionFailed
      # :nocov:
      Rails.logger.warn "Unable to index user in ElasticSearch while running seed script."
      # :nocov:
    end

    user = User.fetch_by_classification(classification.to_s)

    logger.info Rainbow("Ensuring #{classification.text} user exists: #{user.email}").lightblue

    user
  end

  def maybe_make_placeholder_feature!
    # :nocov:
    if Feature.exists?
      logger.info(Rainbow("Placeholder feature exists, skipping").lightblue)

      return
    end

    logger.info(Rainbow("Creating placeholder feature").lightblue)

    Feature.create(
      header: "Welcome to Manifold. An Intuitive, collaborative, open-source platform for scholarly publishing",
      body: "With iterative texts, powerful annotation tools, rich media support, and robust community dialogue, Manifold transforms scholarly publications into living digital works.",
      link_text: "Learn More",
      link_url: "http://localhost:13100/",
      style: "dark",
      foreground_position: "absolute",
      foreground: File.open(Rails.root.join("app", "assets", "images", "seed-feature-foreground.png")),
      creator: cli_user,
      foreground_top: "1.9em",
      live: true
    )
    # :nocov:
  end

  class << self
    def execute(logger = nil)
      new(logger: logger).call
    end
  end
end
# rubocop:enable Layout/LineLength, Metrics/MethodLength
