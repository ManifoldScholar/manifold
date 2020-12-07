class AnalyticsReportType < ClassyEnum::Base
  def reporter; end
end

class AnalyticsReportType::Global < AnalyticsReportType
  def reporter
    Analytics::Reports::Global
  end
end

class AnalyticsReportType::Project < AnalyticsReportType
  def reporter
    Analytics::Reports::ForProject
  end
end

class AnalyticsReportType::Text < AnalyticsReportType
  def reporter
    Analytics::Reports::ForText
  end
end

class AnalyticsReportType::TopProjects < AnalyticsReportType
  def reporter
    Analytics::Reports::TopProjects
  end
end

class AnalyticsReportType::TopSearches < AnalyticsReportType
  def reporter
    Analytics::Reports::TopSearches
  end
end
