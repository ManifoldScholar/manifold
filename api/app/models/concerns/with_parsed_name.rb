module WithParsedName
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable

  KEY_MAP = {
    title: :prefix,
    given: :first_name,
    particle: :middle_name,
    family: :last_name,
    suffix: :suffix
  }.freeze

  included do
    validate :nickname_not_blank!
    validates :first_name, :last_name, length: { maximum: 50 }

    config_accessor :full_name_properties, instance_writer: false do
      []
    end

    before_save :cache_name, if: :full_name_db_cacheable?
    before_validation :ensure_nickname
  end
  def name=(name)
    parts = Namae::Name.parse(name).to_h.compact
    validate_parts!(parts)
    parts.each do |key, value|
      next unless respond_to? KEY_MAP[key]

      write_attribute(KEY_MAP[key], value)
    end
  end

  def full_name_db_cacheable?
    respond_to? "cached_full_name="
  end

  def cache_name
    self.cached_full_name = full_name
  end

  def ensure_nickname
    return unless respond_to? :nickname

    self.nickname = first_name if nickname.blank?
  end

  def name
    "#{first_name} #{last_name}".strip
  end

  def full_name
    full_name_properties.map { |p| send(p) }.reject(&:blank?).join(" ")
  end

  private

  def validate_parts!(parts)
    # rubocop:disable Style/GuardClause
    if parts[:particle].present? && parts[:given].blank?
      parts[:given] = parts[:particle]
      parts[:particle] = nil
    end
    # rubocop:enable Style/GuardClause
  end

  def nickname_not_blank!
    return unless respond_to? :nickname

    errors.add(:nickname, "can't be blank") if nickname.blank?
  end

  class_methods do
    def with_parsed_name(*properties)
      config.full_name_properties = properties
    end

    def parse_name(name)
      parts = Namae::Name.parse(name).to_h.compact
      parts.each_with_object({}) { |(k, v), out| out[KEY_MAP[k]] = v if k.present? }
    end
  end
end
