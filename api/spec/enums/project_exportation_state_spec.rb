require 'rails_helper'

RSpec.describe ProjectExportationState do
  describe ProjectExportationState::Pending, enum: true do
  end

  describe ProjectExportationState::ExportReady, enum: true do
  end

  describe ProjectExportationState::Success, enum: true do
  end

  describe ProjectExportationState::Failure, enum: true do
  end
end
