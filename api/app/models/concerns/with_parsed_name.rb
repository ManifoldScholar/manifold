module WithParsedName
  extend ActiveSupport::Concern

  KEY_MAP = {
    title: :prefix,
    given: :first_name,
    particle: :middle_name,
    family: :last_name,
    suffix: :suffix
  }.freeze

  included do
    validate :nickname_not_blank!

    before_validation :ensure_nickname
  end

  # rubocop:disable Rails/ReadWriteAttribute
  def name=(name)
    parts = Namae::Name.parse(name).to_h.compact
    parts.each do |key, value|
      next unless respond_to? KEY_MAP[key]
      write_attribute(KEY_MAP[key], value)
    end
  end
  # rubocop:enable Rails/ReadWriteAttribute

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

  def nickname_not_blank!
    return unless respond_to? :nickname
    errors.add(:nickname, "can't be blank") if nickname.blank?
  end

  class_methods do
    def with_parsed_name(*properties)
      attr_reader :full_name_properties

      @full_name_properties = properties

      after_initialize do
        @full_name_properties = properties
      end
    end

    def parse_name(name)
      parts = Namae::Name.parse(name).to_h.compact
      parts.each_with_object({}) { |(k, v), out| out[KEY_MAP[k]] = v if k.present? }
    end
  end
end
