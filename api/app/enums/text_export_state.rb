# frozen_string_literal: true

class TextExportState < ClassyEnum::Base
end

class TextExportState::Pending < TextExportState
end

class TextExportState::Processing < TextExportState
end

class TextExportState::Success < TextExportState
end

class TextExportState::Failure < TextExportState
end
