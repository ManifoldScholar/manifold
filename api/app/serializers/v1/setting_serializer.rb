module V1
  class SettingSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    set_id :singleton_guard

    typed_attribute :general, Hash
    typed_attribute :theme, Hash
    typed_attribute :integrations, Hash
    typed_attribute :email, Hash
    typed_attribute :press_logo_styles, Hash
    typed_attribute :press_logo_footer_styles, Hash
    typed_attribute :press_logo_mobile_styles, Hash
    typed_attribute :favicon_styles, Hash
    typed_attribute :copyright_formatted, NilClass
    typed_attribute :calculated, Hash do |object, params|
      object.calculated(params[:current_user])
    end
    typed_attribute :oauth, Hash do |_object, _params|
      ManifoldEnv.oauth.as_json
    end
    typed_attribute :secrets, Hash do |object, _params|
      object.secrets.transform_values do |_value|
        "(redacted)"
      end
    end

  end
end
