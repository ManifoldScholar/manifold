class ExportKind < ClassyEnum::Base
  def epub?
    false
  end
end

class ExportKind::Unknown < ExportKind
end

class ExportKind::EpubV3 < ExportKind
  def epub?
    true
  end
end
