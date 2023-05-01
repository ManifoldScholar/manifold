import { ProjectCollectionWrapperContainer } from "../Wrapper";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/project-collection/Wrapper", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });

  def("abilities", () => ({ update: true }));
  def("projectCollection", () =>
    factory("projectCollection", { attributes: { abilities } })
  );
  def("user", () => factory("user"));
  def("history", () => fixtures.history());
  def("route", () => fixtures.route());
  def("root", () => (
    <BreadcrumbsProvider>
      <ProjectCollectionWrapperContainer
        projectCollections={$projectCollections}
        collectionProjects={[]}
        refresh={jest.fn}
        dispatch={$dispatch}
        history={$history}
        match={{ params: {} }}
        route={$route}
        t={key => key}
      />
    </BreadcrumbsProvider>
  ));

  context("when there are project collections", () => {
    def("projectCollections", () => collectionFactory("projectCollection"));
    it("matches the snapshot when rendered", () => {
      expect(render($withApp($root)).html()).toMatchSnapshot();
    });
  });

  context("when there are no project collections", () => {
    def("projectCollections", () => []);
    it("matches the snapshot when rendered", () => {
      expect(render($withApp($root)).html()).toMatchSnapshot();
    });
  });
});
//
// describe("Backend.ProjectCollection.Wrapper container", () => {
//   const store = build.store();
//   const currentUser = build.entity.user("1");
//   store.dispatch({
//     type: "UPDATE_CURRENT_USER",
//     error: false,
//     payload: {
//       data: currentUser
//     }
//   });
//
//   it("renders correctly when no project collections", () => {
//     const component = renderer.create(
//       wrapWithRouter(
//         <Provider store={store}>
//           <ProjectCollectionWrapperContainer
//             projectCollections={[]}
//             collectionProjects={[]}
//             refresh={jest.fn}
//             dispatch={store.dispatch}
//             history={{}}
//             match={{ params: {} }}
//           />
//         </Provider>
//       )
//     );
//     const tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//   });
//
//   it("renders correctly when no project collections", () => {
//     const component = renderer.create(
//       wrapWithRouter(
//         <Provider store={store}>
//           <ProjectCollectionWrapperContainer
//             projectCollections={[
//               build.entity.projectCollection("1"),
//               build.entity.projectCollection("2")
//             ]}
//             collectionProjects={[]}
//             refresh={jest.fn}
//             dispatch={store.dispatch}
//             history={{}}
//             match={{ params: { id: "1" } }}
//             route={{ routes: [] }}
//           />
//         </Provider>
//       )
//     );
//     const tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });
