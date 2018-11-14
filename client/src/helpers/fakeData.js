const resources = [
  {
    id: 1,
    type: "resources",
    attributes: {
      type: "audio",
      title: "Consectetur Ullamcorper",
      tags: ["Japan"],
      position: 0
    }
  },
  {
    id: 2,
    type: "resources",
    attributes: {
      title: "Cras justo odio, dapibus ac facilisis",
      type: "video",
      externalHost: "vimeo",
      externalIdentifier: "89700651",
      description:
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. " +
        "Donec id elit non mi porta gravida at eget metus. Morbi leo risus, " +
        "porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget " +
        "risus varius blandit sit amet non magna. Integer posuere erat a ante " +
        "venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna " +
        "mollis ornare vel eu leo. Praesent commodo cursus magna, " +
        "vel scelerisque nisl consectetur et.",
      link: "https://vimeo.com/89700651",
      position: 1
    }
  },
  {
    id: 3,
    type: "resources",
    attributes: {
      title: "Cras justo odio, dapibus ac facilisis",
      type: "video",
      externalHost: "youTube",
      externalIdentifier: "YbcxU1IK7s4",
      description:
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. " +
        "Donec id elit non mi porta gravida at eget metus. Morbi leo risus, " +
        "porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget " +
        "risus varius blandit sit amet non magna. Integer posuere erat a ante " +
        "venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna " +
        "mollis ornare vel eu leo. Praesent commodo cursus magna, " +
        "vel scelerisque nisl consectetur et.",
      link: "https://youtu.be/YbcxU1IK7s4",
      position: 2
    }
  },
  {
    id: 4,
    type: "resources",
    attributes: {
      title: "Cras justo odio, dapibus ac facilisis",
      type: "image",
      image: "/static/placeholder/portrait-ndt01.jpg",
      description:
        "Maecenas sed diam eget risus varius blandit sit amet non magna. " +
        "Cras mattis consectetur purus sit amet fermentum. Donec id elit non" +
        " mi porta gravida at eget metus. Curabitur blandit tempus porttitor.",
      link: "/static/placeholder/portrait-ndt01.jpg",
      position: 3
    }
  },
  {
    id: 5,
    type: "resources",
    attributes: {
      title: "Nulla vitae elit libero",
      type: "image",
      image: "/static/placeholder/portrait-unsplash01.jpg",
      description:
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. " +
        "Donec id elit non mi porta gravida at eget metus. Morbi leo risus, " +
        "porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget " +
        "risus varius blandit sit amet non magna. Integer posuere erat a ante " +
        "venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna " +
        "mollis ornare vel eu leo. Praesent commodo cursus magna, " +
        "vel scelerisque nisl consectetur et.",
      link: "/static/placeholder/portrait-unsplash01.jpg",
      position: 4
    }
  },
  {
    id: 6,
    type: "resources",
    attributes: {
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      type: "file",
      image: "/static/placeholder/background-coniferous.jpg",
      description:
        "Maecenas sed diam eget risus varius blandit sit amet non magna. " +
        "Cras mattis consectetur purus sit amet fermentum. Donec id elit non" +
        " mi porta gravida at eget metus. Curabitur blandit tempus porttitor.",
      link: "#",
      tags: ["Japan", "Photography"],
      position: 5
    }
  },
  {
    id: 7,
    type: "resources",
    attributes: {
      type: "presentation",
      title: "Etiam Dolor Ipsum",
      tags: ["Second Interview"],
      position: 6
    }
  },
  {
    id: 8,
    type: "resources",
    attributes: {
      type: "link",
      title: "Lorem ipsum dolor sit, adipiscing elit.",
      position: 7
    }
  },
  {
    id: 9,
    type: "resources",
    attributes: {
      type: "file",
      title: "Venenatis Vehicula",
      tags: ["Photography", "Second Interview"],
      position: 8
    }
  },
  {
    id: 10,
    type: "resources",
    attributes: {
      type: "document",
      title: "Dapibus Magna Elit Justo",
      tags: ["Japan", "Photography"],
      position: 9
    }
  },
  {
    id: 11,
    type: "resources",
    attributes: {
      type: "pdf",
      title: "Vestibulum id ligula porta felis euismod semper.",
      tags: ["Second Interview"],
      position: 10
    }
  },
  {
    id: 12,
    type: "resources",
    attributes: {
      type: "document",
      title: "Dolor Sollicitudin Ultricies",
      position: 11
    }
  },
  {
    id: 13,
    type: "resources",
    attributes: {
      type: "audio",
      title: "Parturient Dolor Ultricies Adipiscing",
      tags: ["Japan", "Second Interview"],
      position: 12
    }
  }
];

const resourceCollection = {
  id: "1234",
  attributes: {},
  links: {},
  relationships: { resources }
};

const resourceCollections = [
  {
    id: 1,
    type: "resourceCollections",
    attributes: {
      image: "/static/placeholder/background-waterfall.jpg",
      title: "Recorded conversations with author; Pre-translated"
    }
  },
  {
    id: 2,
    type: "resourceCollections",
    attributes: {
      image: null,
      title: "Slideshow: photos of original manuscript with handwritten notes"
    }
  },
  {
    id: 3,
    type: "resourceCollections",
    attributes: {
      image: "/static/placeholder/background-coniferous.jpg",
      title: "Untitled"
    }
  }
];

const events = [
  {
    id: 1,
    attributes: {
      eventType: "PROJECT_CREATED",
      event_url: undefined,
      created_at: "2016-06-18 13:55:30",
      subject_id: "1234-1234-1234-1234",
      subject_type: "Project",
      subject_title: "Japanese Documentary Film",
      subject_subtitle: "The Meiji Era through Hiroshima",
      event_title: "Project Kickoff",
      event_subtitle: "A Manifold project is born!",
      attribution: undefined,
      attribution_url: undefined,
      excerpt: undefined,
      project_id: "AAA-BBB"
    }
  },
  {
    id: 2,
    attributes: {
      eventType: "RESOURCE_CREATED",
      event_url: "/browse/resource/1",
      created_at: "2016-7-21 13:55:30",
      subject_id: "1234-1234-1234-1234",
      subject_type: "Resource",
      subject_title: "Image Name Goes Here",
      event_title: "Image Name Goes Here",
      event_subtitle: undefined,
      subject_subtitle: undefined,
      attribution: undefined,
      attribution_url: undefined,
      excerpt: undefined,
      project_id: "AAA-BBB"
    }
  },
  {
    id: 3,
    attributes: {
      eventType: "TEXT_ADDED",
      event_url: undefined,
      created_at: "2016-8-20 13:55:30",
      subject_id: "1234-1234-1234-1234",
      subject_type: "Text",
      subject_title: "Japanese Documentary Film",
      subject_subtitle: "The Meiji Era through Hiroshima",
      event_title: "Japanese Documentary Film",
      event_subtitle: "The Meiji Era through Hiroshima",
      attribution: undefined,
      attribution_url: undefined,
      excerpt: undefined,
      project_id: "AAA-BBB"
    }
  },
  {
    id: 4,
    attributes: {
      eventType: "ANNOTATION_CREATED",
      event_url: "#",
      type: "annotation_created",
      created_at: "2016-10-17 13:55:30",
      subject_id: "1234-1234-1234-1234",
      subject_type: "Text",
      subject_title: "Japanese Documentary Film",
      subject_subtitle: "The Meiji Era through Hiroshima",
      attribution: "Zach Davis",
      attribution_url: undefined,
      excerpt:
        "Maecenas sed diam eget risus varius blandit sit amet non magna. " +
        "Aenean lacinia bibendum nulla sed consectetur.",
      project_id: "AAA-BBB"
    }
  },
  {
    id: 5,
    attributes: {
      eventType: "ANNOTATION_CREATED",
      event_url: "#",
      type: "annotation_created",
      created_at: "2016-10-20 13:55:30",
      subject_id: "1234-1234-1234-1234",
      subject_type: "Text",
      subject_title: "Japanese Documentary Film",
      subject_subtitle: "The Meiji Era through Hiroshima",
      attribution: "Susan Doerr",
      attribution_url: undefined,
      excerpt:
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur et." +
        " Vestibulum id ligula porta felis euismod semper.",
      project_id: "AAA-BBB"
    }
  },
  {
    id: 6,
    attributes: {
      eventType: "TWEET",
      event_url: "https://twitter.com/noctambulate/status/786361503586758656",
      created_at: "2016-10-23 13:55:30",
      subject_id: "1234-1234-1234-1234",
      subject_type: "Project",
      subject_title: "Japanese Documentary Film",
      subject_subtitle: "The Meiji Era through Hiroshima",
      attribution_name: "Doug Armato",
      attribution_id: "noctambulate",
      attribution_url: "https://twitter.com/noctambulate/",
      excerpt:
        "The lowdown on lefse (must be russet potatoes!) from Beatrice Ojakanga" +
        "s at the @AmSwedInstitute @UMinnPress",
      project_id: "AAA-BBB"
    }
  },
  {
    id: 5,
    attributes: {
      eventType: "ANNOTATION_CREATED",
      event_url: "#",
      type: "annotation_created",
      created_at: "2016-10-20 13:55:30",
      subject_id: "1234-1234-1234-1234",
      subject_type: "Text",
      subject_title: "Japanese Documentary Film",
      subject_subtitle: "The Meiji Era through Hiroshima",
      attribution: "Gabriel Hale Thomas Chud Marcela Masterson Blair",
      attribution_url: undefined,
      excerpt:
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. " +
        "Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
      project_id: "AAA-BBB"
    }
  }
];

const backendAuthors = [];

const backendEditors = [
  {
    id: 1,
    attributes: {
      name: "Matt Garrish",
      first_name: "Matt",
      middle_name: "",
      last_name: "Garrish",
      display_name: "",
      role: "creator"
    },
    avatar: "/static/placeholder/user-avatar-dreft01.jpg"
  },
  {
    id: 2,
    attributes: {
      name: "Markus Gylling",
      first_name: "Markus",
      middle_name: "",
      last_name: "Gylling",
      display_name: "",
      role: "creator"
    },
    avatar: "/static/placeholder/user-avatar-nornes01.jpg"
  },
  {
    attributes: {
      name: "Liza Weinstein",
      first_name: "Liza",
      middle_name: "",
      last_name: "Weinstein",
      display_name: "",
      role: "creator"
    },
    avatar: "/static/placeholder/user-avatar-rowan01.jpg"
  }
];

export default {
  resources,
  events,
  resourceCollections,
  resourceCollection,
  backendAuthors,
  backendEditors
};
