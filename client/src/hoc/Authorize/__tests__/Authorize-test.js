import { AuthorizeComponent } from "../";

describe("hoc/Authorize", () => {
  def("user", () => factory("user"));
  def("authentication", () =>
    fixtures.authentication({ user: $user })
  );
  def("child", () => <div>How is babby formed?</div>);

  context("when kind matches", () => {
    def("root", () => (
      <AuthorizeComponent
        kind="any"
        authentication={$authentication}
        children={$child}
      />
    ));

    it("matches the snapshot when rendered", () => {
      expect(mount($withApp($root)).html()).toMatchSnapshot();
    });
  });

  context("when kind does not match", () => {
    def("root", () => (
      <AuthorizeComponent kind="any" authentication={{}} children={$child} />
    ));

    it("matches the snapshot when rendered", () => {
      expect(mount($withApp($root)).html()).toMatchSnapshot();
    });
  });

  context("when ability matches", () => {
    def("root", () => (
      <AuthorizeComponent
        entity="user"
        ability="create"
        authentication={$authentication}
        children={$child}
      />
    ));

    it("matches the snapshot when rendered", () => {
      expect(mount($withApp($root)).html()).toMatchSnapshot();
    });
  });

  context("when ability does not match", () => {
    def("root", () => (
      <AuthorizeComponent
        entity="user"
        ability="create"
        authentication={{}}
        children={$child}
      />
    ));

    it("matches the snapshot when rendered", () => {
      expect(mount($withApp($root)).html()).toMatchSnapshot();
    });
  });
});
