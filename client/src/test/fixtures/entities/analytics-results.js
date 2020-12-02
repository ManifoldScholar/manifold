const globalAnalytics = () => ({
  type: "analyticsResults",
  attributes: {
    data: [
      {
        name: "daily_visitors",
        meta: {
          type: "xy",
          x_type: "date",
          y_type: "int"
        },
        data: [
          {
            x: "2020-12-03",
            y: 10
          },
          {
            x: "2020-12-04",
            y: 41
          },
          {
            x: "2020-12-05",
            y: 35
          },
          {
            x: "2020-12-06",
            y: 51
          },
          {
            x: "2020-12-07",
            y: 49
          },
          {
            x: "2020-12-08",
            y: 62
          },
          {
            x: "2020-12-09",
            y: 69
          },
          {
            x: "2020-12-10",
            y: 91
          },
          {
            x: "2020-12-11",
            y: 153
          }
        ]
      },
      {
        name: "returning_visitors",
        meta: {
          type: "float"
        },
        data: {
          value: 1
        }
      },
      {
        name: "average_visit_duration",
        meta: {
          type: "interval"
        },
        data: {
          value: "01:23:54"
        }
      },
      {
        name: "top_projects",
        meta: {
          type: "array",
          array_content: "json"
        },
        data: [
          {
            project_id: "95e0cc2e-25cd-418b-a498-adc198cfbd30",
            project_title: "Dracula",
            view_count: 101
          },
          {
            project_id: "9dc8ecdf-f748-4251-9110-ef9c712859c6",
            project_title: "The Mysterious Island",
            view_count: 42
          },
          {
            project_id: "b2161386-3217-430b-bbff-c325c5a9e057",
            project_title: "Short Fiction",
            view_count: 29
          }
        ]
      },
      {
        name: "active_users",
        meta: {
          type: "float"
        },
        data: {
          value: 0.0172413793103448
        }
      },
      {
        name: "favorited_projects",
        meta: {
          type: "float"
        },
        data: {
          value: 2.0
        }
      },
      {
        name: "top_search_terms",
        meta: {
          type: "array",
          array_content: "json"
        },
        data: [
          {
            search_term: "asdf",
            count: 1
          },
          {
            search_term: "manifold",
            count: 2
          }
        ]
      }
    ]
  }
});

export default globalAnalytics;
