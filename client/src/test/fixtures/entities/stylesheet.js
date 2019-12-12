const stylesheet = () => ({
  type: "stylesheets",
  attributes: {
    position: 1,
    name: "Slarmbo",
    rawStyles: ".some-class { font-weight: bold }",
    styles: ".manifold-text-section .some-class { font-weight: bold }"
  },
  relationships: {
    text: null
  }
});

export default stylesheet;
