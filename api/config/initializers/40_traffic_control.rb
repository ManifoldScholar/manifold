module Patches
  module MakeTrafficControlSupportRedisNamespace
    def client_class_type(client)
      if client.instance_of?(::Redis::Namespace)
        Suo::Client::Redis
      else
        super
      end
    end
  end
end

ActiveJob::TrafficControl.singleton_class.prepend(
  Patches::MakeTrafficControlSupportRedisNamespace
)
ActiveJob::TrafficControl.client =
  ManifoldEnv.redis.build_connection_pool "traffic-control", size: 25
ActiveJob::TrafficControl.cache_client = Rails.cache
