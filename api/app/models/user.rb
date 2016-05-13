# The User model
class User < ActiveRecord::Base
  has_secure_password
  has_attached_file :avatar,
                    styles: { medium: "300x300>", thumb: "100x100>" }

  validates :password, length: { minimum: 8 }, allow_nil: true
  validates :password, confirmation: true,
                       unless: proc { |user| user.password.blank? }
  validates :nickname, :first_name, :last_name, :email, presence: true
  validates :email, uniqueness: true
  validates_attachment_content_type :avatar,
                                    content_type: %r{\Aimage\/.*\Z},
                                    unless: proc { |record| record[:image].nil? }

  before_validation :ensure_nickname

  def ensure_nickname
    self.nickname = first_name if nickname.blank?
  end

  # Transform a name into first and last names
  def name=(name)
    name_parts = name.split
    first = name_parts[0]
    last = name_parts[-1]
    self.first_name = first
    self.last_name = last
  end

  def avatar_url
    return nil unless avatar.present?
    ENV["API_DOMAIN"] + avatar.url
  end
end
