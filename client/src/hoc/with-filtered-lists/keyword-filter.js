export default function keywordFilter({ sticky = false } = {}) {
  return {
    sticky,
    params: [
      {
        label: "Search...",
        name: "keyword",
        value: ""
      }
    ]
  };
}
