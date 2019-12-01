class IngestionChannel < ApplicationCable::Channel

  def ingestion
    @ingestion ||= Ingestion.find(params[:ingestion])
  end

  def subscribed
    return unless current_user.can_read? ingestion

    stream_for ingestion
  end

  def reset
    send_start
    ingestion.reset
    ingestion.save
    send_model(ingestion)
    send_end
  rescue AASM::InvalidTransition
    send_end
  end

  def analyze
    send_start
    ingestion.analyze
    ingestion.save
    send_model(ingestion)
    send_end
  rescue AASM::InvalidTransition
    send_end
  end

  def process
    send_start
    ingestion.process(current_user)
    ingestion.save
    send_model(ingestion)
    send_end
  rescue AASM::InvalidTransition
    send_end
  end

  def reingest
    send_start
    ingestion.reset
    ingestion.analyze
    ingestion.process(current_user)
    ingestion.save
    send_model(ingestion)
    send_end
  rescue AASM::InvalidTransition
    send_end
  end

  protected

  def send_start
    IngestionChannel.broadcast_to ingestion, type: "message", payload: "START_ACTION"
  end

  def send_end
    IngestionChannel.broadcast_to ingestion, type: "message", payload: "END_ACTION"
  end

  def send_model(ingestion)
    serialization_options = { current_user: current_user }
    serialization = V1::IngestionSerializer.new(
      ingestion,
      serialization_options
    ).serializable_hash
    IngestionChannel.broadcast_to ingestion, type: "entity", payload: serialization
  end

end
