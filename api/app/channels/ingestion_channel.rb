class IngestionChannel < ApplicationCable::Channel

  def ingestion
    @ingestion ||= Ingestion.find(params[:ingestion])
  end

  def subscribed
    return unless current_user.can_read? ingestion
    stream_for ingestion
  end

  def reset
    ingestion.reset
    ingestion.save
    send_model(ingestion)
  end

  def analyze
    ingestion.analyze
    ingestion.save
    send_model(ingestion)
  end

  def process
    ingestion.process
    ingestion.save
    send_model(ingestion)
  end

  protected

  def send_model(ingestion)
    options = { scope: current_user }
    serialization = ActiveModelSerializers::SerializableResource.new(ingestion, options)
    IngestionChannel.broadcast_to ingestion, type: "entity", payload: serialization
  end

end
