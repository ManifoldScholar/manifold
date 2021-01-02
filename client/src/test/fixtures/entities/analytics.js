export const globalAnalytics = () => ({
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
            x: "2020-11-24",
            y: 76
          },
          {
            x: "2020-11-25",
            y: 54
          },
          {
            x: "2020-11-26",
            y: 99
          },
          {
            x: "2020-11-27",
            y: 142
          },
          {
            x: "2020-11-28",
            y: 65
          },
          {
            x: "2020-11-29",
            y: 51
          },
          {
            x: "2020-11-30",
            y: 97
          },
          {
            x: "2020-12-01",
            y: 32
          },
          {
            x: "2020-12-02",
            y: 112
          },
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
            y: 88
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
            y: 106
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
            projectId: "95e0cc2e-25cd-418b-a498-adc198cfbd30",
            projectTitle: "Dracula",
            viewCount: 101
          },
          {
            projectId: "9dc8ecdf-f748-4251-9110-ef9c712859c6",
            projectTitle: "The Mysterious Island",
            viewCount: 42
          },
          {
            projectId: "b2161386-3217-430b-bbff-c325c5a9e057",
            projectTitle: "Short Fiction",
            viewCount: 29
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
            searchTerm: "manifold",
            count: 2
          },
          {
            searchTerm: "babadook",
            count: 1
          }
        ]
      }
    ]
  }
});

export const projectAnalytics = () => ({
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
            y: 5
          },
          {
            x: "2020-12-04",
            y: 21
          },
          {
            x: "2020-12-05",
            y: 35
          },
          {
            x: "2020-12-06",
            y: 22
          },
          {
            x: "2020-12-07",
            y: 14
          },
          {
            x: "2020-12-08",
            y: 32
          },
          {
            x: "2020-12-09",
            y: 34
          },
          {
            x: "2020-12-10",
            y: 56
          },
          {
            x: "2020-12-11",
            y: 78
          }
        ]
      },
      {
        name: "annotations",
        meta: {
          type: "array",
          array_content: "json"
        },
        data: [
          {
            format: "annotation",
            private: false,
            count: 2
          },
          {
            format: "annotation",
            private: true,
            count: 1
          }
        ]
      },
      {
        name: "favorites_this_period",
        meta: {
          type: "int"
        },
        data: {
          value: 4
        }
      },
      {
        name: "total_favorites",
        meta: {
          type: "int"
        },
        data: {
          value: 32
        }
      }
    ]
  },
  meta: {
    partial: false
  }
});
