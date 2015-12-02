class User < ActiveRecord::Base
  has_secure_password
  validates :password, presence: true, confirmation: true, length: { minimum: 8 }
end
