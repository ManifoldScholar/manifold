module Helpers

  def auth_headers(email, password)
    post api_v1_tokens_path, params: {email: email, password: password}
    token = ""
    if response.success?
      parsed = JSON.parse(response.body)
      token = parsed["authToken"]
    end
    headers = {
      "Authorization": "Bearer #{token}"
    }
    return headers
  end

  def create_user_and_authenticate(password = "testtest123")
    user = FactoryGirl.create(:user, password: password, password_confirmation: password)
    headers = auth_headers(user.email, password)
    return {user: user, headers: headers, password: password}
  end

end
