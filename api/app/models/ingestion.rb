# frozen_string_literal: true

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
  has_many :ingestion_messages, -> { in_default_order }, inverse_of: :ingestion, dependent: :delete_all

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
    class_eval <<~RUBY, __FILE__, __LINE__ + 1
      def #{severity.downcase}(message = nil, progname = nil, &block)
        add("#{severity}", message, progname, &block)
      end
    RUBY
  end

  before_validation :infer_kind!
  before_save :commit_log
  before_update :commit_log

  # @!group Main Entry Points

  # @see Ingestions::ProcessJob
  # @return [void]
  def perform_process!(user)
    process! user
    save!
  end

  # @see Ingestions::ReingestJob
  # @return [void]
  def perform_reingest!(user)
    reset!
    perform_process! user
  end

  # @!endgroup

  # @return [Ingestions::Context]
  def build_context
    ::Ingestions::Context.new(self)
  end

  def reset_strategy
    prune_root_path!

    update_column(:strategy, nil)
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

  # @see Ingestions::Concerns::FileOperations#prune_root_path!
  # @return [void]
  def prune_root_path!
    build_context.prune_root_path!
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

    ::Ingestions::LogMessageJob.perform_later(
      ingestion_id: id,
      kind: "log",
      payload: line,
      severity: severity.downcase,
    )
  end

  def clear_log
    self.log = []
  end

  def commit_log
    self.log = log_buffer
    self.log_buffer = []
  end

  # @param [User] user
  # @return [void]
  def begin_processing(user)
    update_column :processing_failed, false

    target_kind.begin_processing(user, self)
  end

  # @param [StandardError, Ingestions::IngestionError, ActiveModel::Errors] errors
  # @return [void]
  def handle_ingestion_exception(errors)
    update_column :processing_failed, true

    error("Processing failed.\n")

    handle_ingestion_errors!(errors)

    processing_failure
  end

  private

  # @param [StandardError, Ingestions::IngestionError, ActiveModel::Errors] errors
  # @return [void]
  def handle_ingestion_errors!(errors)
    if errors.respond_to?(:full_messages)
      output_errors(errors)
    else
      case errors
      when StandardError
        compose_and_output_backtrace(errors)
      else
        # :nocov:
        fatal("Something went wrong with ingestion: #{errors.inspect}")
        # :nocov:
      end
    end
  end

  # @param [StandardError, Ingestions::IngestionError] errors
  # @return [void]
  def compose_and_output_backtrace(errors)
    output = errors.message

    Rails.backtrace_cleaner.clean(errors.backtrace).each do |line|
      output += "\n#{line}"
    end

    error(output)
  end

  # @param [ActiveModel::Errors] errors
  # @return [void]
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
