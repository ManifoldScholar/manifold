module V1
  class NotificationPreferenceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :kind, NilClass
    typed_attribute :frequency, NilClass
  end
end
