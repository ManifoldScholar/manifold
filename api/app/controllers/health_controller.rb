class HealthController < ApplicationController
  def show
    render json: { ok: true }
  end
end
