module V1
  class NotificationPreferenceSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    attributes :kind,
               :frequency
  end
end
