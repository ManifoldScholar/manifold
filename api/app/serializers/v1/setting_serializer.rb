module V1
  class SettingSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    set_id :singleton_guard

    typed_attribute :general, Types::Hash
    typed_attribute :theme, Types::Hash
    typed_attribute :integrations, Types::Hash
    typed_attribute :email, Types::Hash
    typed_attribute :press_logo_styles, Types::Hash
    typed_attribute :press_logo_footer_styles, Types::Hash
    typed_attribute :press_logo_mobile_styles, Types::Hash
    typed_attribute :favicon_styles, Types::Hash
    typed_attribute :copyright_formatted, NilClass
    typed_attribute :calculated, Types::Hash do |object, params|
      object.calculated(params[:current_user])
    end
    typed_attribute :oauth, Types::Hash do |_object, _params|
      ManifoldEnv.oauth.as_json
    end
    typed_attribute :secrets, Types::Hash do |object, _params|
      object.secrets.transform_values do |_value|
        "(redacted)"
      end
    end

  end
end
