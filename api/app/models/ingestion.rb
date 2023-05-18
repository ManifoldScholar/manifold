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

  classy_enum_attr :target_kind, enum: "IngestionTargetKind", allow_blank: false

  # Associations
  belongs_to :text, optional: true
  belongs_to :text_section, optional: true
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
  before_validation :infer_kind!

  def reset_strategy
    self.strategy = nil
  end

  def file_based_ingestion?
    external_source_url.blank?
  end

  def source_tempfile
    source.download
  end

  def ingestable?
    valid?
  end

  def reingest?
    target_kind.reingest?(self)
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

  def begin_processing(user)
    target_kind.begin_processing(user, self)
  end

  def handle_ingestion_exception(errors)
    error("Processing failed.\n")

    if errors.respond_to?(:full_messages)
      output_errors(errors)
    else
      compose_and_output_backtrace(errors)
    end

    processing_failure
  end

  private

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

  # @return [void]
  def infer_kind!
    return if target_kind

    self.target_kind = derive_kind
  end

  def derive_kind
    if text_section
      "text_section"
    else
      "text"
    end
  end

end
