class Ahoy::Store < Ahoy::DatabaseStore
  def authenticate(data)
    # disables automatic linking of visits and users
  end
end

Ahoy.mask_ips = true
Ahoy.cookies = false
Ahoy.api = false
