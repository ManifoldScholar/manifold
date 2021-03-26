class AuthConstraint

  attr_reader :request

  def initialize(request)
    @request = request
  end

  def admin?
    token = request.cookies["authToken"]
    return false unless token.present?

    decoded = AuthToken.decode(token)
    id = decoded["user_id"]
    return false unless id

    user = User.find(id)
    return false unless user

    user.admin?
  rescue JWT::DecodeError
    false
  end

end
