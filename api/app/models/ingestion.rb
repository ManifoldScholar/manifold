require "stringio"

# Connects texts to resources that were sources for text sections during ingestion
class Ingestion < ApplicationRecord
  include SerializedAbilitiesFor
  include Attachments
  include IngestionUploader::Attachment.new(:source)
  include TrackedCreator
  include AASM

  # Authorization
  include Authority::Abilities
  self.authorizer_name = "ProjectRestrictedChildAuthorizer"

  attr_writer :log_buffer

  # Associations
  belongs_to :text, optional: true
  belongs_to :project

  # Validations
  validates :source, presence: true, if: :file_based_ingestion?
  validates :external_source_url, presence: true, unless: :file_based_ingestion?
  aasm column: "state" do
    state :sleeping, initial: true
    state :processing
    state :finished

    event :process, after: :begin_processing do
      transitions from: :sleeping, to: :processing
    end

    event :processing_success do
      transitions from: :processing, to: :finished
    end

    event :processing_failure do
      transitions from: :processing, to: :finished
    end

    event :reset, after: :reset_strategy do
      transitions from: :processing, to: :sleeping
      transitions from: :finished, to: :sleeping
    end
  end

  %w(DEBUG INFO WARN ERROR FATAL UNKNOWN).each do |severity|
    class_eval <<-EOT, __FILE__, __LINE__ + 1
      def #{severity.downcase}(message = nil, progname = nil, &block)
        add("#{severity}", message, progname, &block)
      end
    EOT
  end

  before_save :commit_log
  before_update :commit_log

  def reset_strategy
    self.strategy = nil
  end

  def file_based_ingestion?
    external_source_url.blank?
  end

  def ingestable?
    valid?
  end

  def reingest?
    text.present?
  end

  def strategy_label
    return nil if strategy.blank?

    klass = strategy.constantize
    klass.respond_to?(:label) ? klass.label : klass.name
  end

  def log_buffer
    @log_buffer ||= []
  end

  def add(severity, message = nil, _progname = nil)
    line = [severity, message]
    log_buffer << line
    return if severity == "DEBUG"

    IngestionChannel.broadcast_to self, type: "log", payload: line
  end

  def clear_log
    self.log = []
  end

  def commit_log
    self.log = log_buffer
    self.log_buffer = []
  end

  def ingestion_source
    return local_source_path if file_based_ingestion?

    external_source_url
  end

  # rubocop:disable Metrics/MethodLength
  def begin_processing(processing_user = nil)
    # Announce the new state of the ingestion.
    serialization_options = { current_user: processing_user }
    serialization = V1::IngestionSerializer.new(
      self,
      serialization_options
    ).serializable_hash
    IngestionChannel.broadcast_to self, type: "entity", payload: serialization

    begin
      outcome = nil
      PaperTrail.request(whodunnit: processing_user) do
        outcome = Ingestions::Ingestor.run ingestion: self
      end
      outcome
    rescue StandardError => e
      return handle_ingestion_exception(e)
    end

    if outcome.valid?
      self.text = outcome.result
      info("\nIngestion Complete.")
      processing_success
    else
      handle_ingestion_exception(outcome.errors)
    end
  end

  # rubocop:enable Metrics/MethodLength

  private

  def handle_ingestion_exception(errors)
    error("Processing failed.\n")

    if errors.respond_to?(:full_messages)
      output_errors(errors)
    else
      compose_and_output_backtrace(errors)
    end

    processing_failure
  end

  def compose_and_output_backtrace(errors)
    output = errors.message
    Rails.backtrace_cleaner.clean(errors.backtrace).each do |line|
      output += "\n#{line}"
    end

    error(output)
  end

  def output_errors(errors)
    errors.full_messages.each do |e|
      error(e)
    end
  end

end
