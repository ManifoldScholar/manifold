# rubocop:disable Metrics/BlockLength
namespace :ingest do

  desc "Ingests a single text into Manifold"
  task :new, [:path, :log_level] => :environment do |_t, args|
    ingest(args.path, args.log_level)
  end

  desc "Ingests a single text into Manifold"
  task :update, [:path, :log_level, :text_id] => :environment do |_t, args|
    reingest(args.path, args.log_level, args.text_id)
  end

  def reingest(path, log_level, text_id)
    path ||= raise I18n.t("rake.ingest.errors.missing_path")
    log_level ||= "debug"
    Ingestor.logger = Logger.new(STDOUT)
    Ingestor.logger.level = Logger.const_get(log_level.upcase.to_sym)
    text = Text.find(text_id)
    cli_user = User.find_by(is_cli_user: true)
    Ingestor.ingest_update(path, cli_user, text)
    Ingestor.reset_logger
  end

  def ingest(path, log_level)
    path ||= raise I18n.t("rake.ingest.errors.missing_path")
    log_level ||= "info"
    Ingestor.logger = Logger.new(STDOUT)
    Ingestor.logger.level = Logger.const_get(log_level.upcase.to_sym)
    cli_user = User.find_by(is_cli_user: true)
    Ingestor.ingest(path, cli_user)
    Ingestor.reset_logger
  end
end
# rubocop:enable Metrics/BlockLength
