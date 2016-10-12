const resources = [
  {
    id: 1,
    type: "resources",
    attributes: {
      type: 'audio',
      title: 'Consectetur Ullamcorper',
      tags: [
        'Japan'
      ],
      position: 0
    },
  },
  {
    id: 2,
    type: "resources",
    attributes: {
      title: 'Cras justo odio, dapibus ac facilisis',
      type: 'video',
      externalHost: 'vimeo',
      externalIdentifier: '89700651',
      description:
      'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. ' +
      'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, ' +
      'porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget ' +
      'risus varius blandit sit amet non magna. Integer posuere erat a ante ' +
      'venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna ' +
      'mollis ornare vel eu leo. Praesent commodo cursus magna, ' +
      'vel scelerisque nisl consectetur et.',
      link: 'https://vimeo.com/89700651',
      position: 1
    }
  },
  {
    id: 3,
    type: "resources",
    attributes: {
      title: 'Cras justo odio, dapibus ac facilisis',
      type: 'video',
      externalHost: 'youTube',
      externalIdentifier: 'YbcxU1IK7s4',
      description:
      'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. ' +
      'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, ' +
      'porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget ' +
      'risus varius blandit sit amet non magna. Integer posuere erat a ante ' +
      'venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna ' +
      'mollis ornare vel eu leo. Praesent commodo cursus magna, ' +
      'vel scelerisque nisl consectetur et.',
      link: 'https://youtu.be/YbcxU1IK7s4',
      position: 2
    }
  },
  {
    id: 4,
    type: "resources",
    attributes: {
      title: 'Cras justo odio, dapibus ac facilisis',
      type: 'image',
      image: '/static/placeholder/portrait-ndt01.jpg',
      description:
      'Maecenas sed diam eget risus varius blandit sit amet non magna. ' +
      'Cras mattis consectetur purus sit amet fermentum. Donec id elit non' +
      ' mi porta gravida at eget metus. Curabitur blandit tempus porttitor.',
      link: '/static/placeholder/portrait-ndt01.jpg',
      position: 3
    }
  },
  {
    id: 5,
    type: "resources",
    attributes: {
      title: 'Nulla vitae elit libero',
      type: 'image',
      image: '/static/placeholder/portrait-unsplash01.jpg',
      description:
      'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. ' +
      'Donec id elit non mi porta gravida at eget metus. Morbi leo risus, ' +
      'porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget ' +
      'risus varius blandit sit amet non magna. Integer posuere erat a ante ' +
      'venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna ' +
      'mollis ornare vel eu leo. Praesent commodo cursus magna, ' +
      'vel scelerisque nisl consectetur et.',
      link: '/static/placeholder/portrait-unsplash01.jpg',
      position: 4
    }
  },
  {
    id: 6,
    type: "resources",
    attributes: {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      type: 'file',
      image: '/static/placeholder/background-coniferous.jpg',
      description:
      'Maecenas sed diam eget risus varius blandit sit amet non magna. ' +
      'Cras mattis consectetur purus sit amet fermentum. Donec id elit non' +
      ' mi porta gravida at eget metus. Curabitur blandit tempus porttitor.',
      link: '#',
      tags: [
        'Japan',
        'Photography'
      ],
      position: 5
    }
  },
  {
    id: 7,
    type: "resources",
    attributes: {
      type: 'presentation',
      title: 'Etiam Dolor Ipsum',
      tags: [
        'Second Interview'
      ],
      position: 6
    }
  },
  {
    id: 8,
    type: "resources",
    attributes: {
      type: 'link',
      title: 'Lorem ipsum dolor sit, adipiscing elit.',
      position: 7
    }
  },
  {
    id: 9,
    type: "resources",
    attributes: {
      type: 'file',
      title: 'Venenatis Vehicula',
      tags: [
        'Photography',
        'Second Interview'
      ],
      position: 8
    }
  },
  {
    id: 10,
    type: "resources",
    attributes: {
      type: 'document',
      title: 'Dapibus Magna Elit Justo',
      tags: [
        'Japan',
        'Photography'
      ],
      position: 9
    }
  },
  {
    id: 11,
    type: "resources",
    attributes: {
      type: 'pdf',
      title: 'Vestibulum id ligula porta felis euismod semper.',
      tags: [
        'Second Interview'
      ],
      position: 10
    }
  },
  {
    id: 12,
    type: "resources",
    attributes: {
      type: 'document',
      title: 'Dolor Sollicitudin Ultricies',
      position: 11
    }
  },
  {
    id: 13,
    type: "resources",
    attributes: {
      type: 'audio',
      title: 'Parturient Dolor Ultricies Adipiscing',
      tags: [
        'Japan',
        'Second Interview'
      ],
      position: 12
    }
  }
];

const resourceCollection = {
  id: "1234",
  attributes: { },
  links: { },
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
    title: "Talking about books!",
    user: {
      displayName: "John Milton"
    },
    content: "Event Content",
    type: "file",
    date: "Jan 5, 2016"
  },
  {
    title: "Talking about books!",
    user: {
      displayName: "John Milton"
    },
    content: "Event Talking about books! Talking aboutTalking about books! books!Content",
    type: "file",
    date: "Jan 5, 2016"
  },
  {
    title: "Talking about books! Talking about books! Talking about books! Talking " +
    "about books! Talking about books! Talking about books!",
    user: {
      displayName: "John Milton"
    },
    content: "Event Content",
    type: "file",
    date: "Jan 5, 2016"
  },
  {
    title: "Talking about books!",
    user: {
      displayName: "John Milton"
    },
    content: "Event Talking about books! Content",
    type: "file",
    date: "Jan 5, 2016"
  }
];

export default {
  resources,
  events,
  resourceCollections,
  resourceCollection
};
