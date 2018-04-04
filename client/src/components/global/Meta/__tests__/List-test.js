import React from "react";
import renderer from "react-test-renderer";
import List from "../List";

describe("Global.Meta.List component", () => {
  const longValue = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tempus fermentum semper. Nullam at lobortis velit, at pellentesque sapien. Cras ornare tortor ut eleifend porta. Donec sit amet tellus vitae ex euismod eleifend ut id mauris. Fusce fermentum mauris sed augue efficitur, at bibendum est pulvinar. Curabitur ac ultricies neque, sit amet lacinia turpis. Phasellus fermentum tincidunt nisi, ac vulputate ex posuere quis. Proin at cursus nisi, et euismod tellus. Cras sapien mauris, scelerisque ac condimentum sit amet, viverra non urna. Proin sit amet velit nec est interdum sodales et vitae sem. Mauris vehicula, nunc ornare condimentum consequat, mauris metus tristique mi, sollicitudin auctor ex tellus semper elit. Quisque massa sapien, condimentum at placerat eu, volutpat sed purus. Sed rhoncus, nulla ac malesuada tempus, orci sapien feugiat lectus, nec tristique lorem ex non metus. Sed ullamcorper tristique scelerisque. Aliquam varius ultricies odio eu placerat. In sed efficitur turpis, vel condimentum orci. Aliquam blandit dolor finibus tellus ornare, ac hendrerit elit pulvinar. Suspendisse tortor mi, feugiat sed mi vel, pulvinar tempor tellus. Nulla sagittis, dui vitae sodales viverra, augue metus ultrices nisl, sit amet efficitur arcu velit sit amet ante. Vestibulum dapibus convallis nisi vel imperdiet. Pellentesque fermentum finibus sapien in faucibus. Sed fermentum, est vel faucibus auctor, risus libero interdum ligula, sit amet sagittis massa enim id mi. Curabitur in aliquet purus, eget volutpat est. Phasellus et lectus in neque tempor fermentum sed nec ligula. Praesent semper felis vestibulum lorem pellentesque, sed tristique felis congue. In nibh massa, ullamcorper id nulla et, accumsan facilisis tortor. Vivamus vehicula, metus vel tincidunt mattis, purus augue pellentesque arcu, ac ultrices leo sapien et arcu. Proin placerat congue iaculis. In elementum dictum justo, sit amet vulputate sem dapibus in. Quisque consequat ipsum nec nulla porttitor, vitae semper ipsum sagittis. Maecenas eget justo urna. Vestibulum."
  const metadata = { propOne: "valueOne", propTwo: "valueTwo", propThree: longValue };
  const map = ["propTwo", "propOne", "propThree"];

  it("renders correctly when sorted by length", () => {
    const component = renderer.create(
      <List metadata={metadata} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when sorted by map prop", () => {
    const component = renderer.create(
      <List map={map} metadata={metadata} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
