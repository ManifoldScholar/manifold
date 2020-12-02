import React from "react";
import { text, select } from "@storybook/addon-knobs";
import { storiesOf } from "helpers/storybook/exports";
import Block, {
  Chart,
  Figure,
  FigureList,
  List,
  Table,
  TextNodeTable,
  Time,
  ProjectRow
} from "backend/components/analytics";
import {
  chart,
  figureList,
  time,
  list,
  table,
  projectTable,
  textNodeTable
} from "./sampleBlocks";

storiesOf("Backend/Analytics/Block", module)
  .add("Chart", () => {
    const { icon, title, description, data, dataLabel } = chart;
    return (
      <Block icon={icon} title={title} description={description}>
        <Chart data={data} dataLabel={dataLabel} />
      </Block>
    );
  })
  .add("Figure", () => {
    const icon = select(
      "Icon",
      {
        Reload: "reload32",
        Bookmark: "bookmark32",
        Comment: "commentPencil32"
      },
      "reload32"
    );
    const title = text("Title", "Return Visits");
    const stat = text("Stat", "87%");
    const caption = text(
      "Caption",
      "274 of 316 visitors were making a return visit"
    );

    return (
      <Block icon={icon} title={title}>
        <Figure stat={stat} caption={caption} />
      </Block>
    );
  })
  .add("Figure List", () => {
    const { icon, title, figures } = figureList;
    return (
      <Block icon={icon} title={title}>
        <FigureList figures={figures} />
      </Block>
    );
  })
  .add("Time", () => {
    const {
      title,
      data: { value }
    } = time;
    return (
      <Block icon="timerClock32" title={title}>
        <Time time={value} />
      </Block>
    );
  })
  .add("List", () => {
    const { icon, title, description, items } = list;
    return (
      <Block icon={icon} title={title} description={description}>
        <List items={items} />
      </Block>
    );
  })
  .add("Table", () => {
    const { icon, title, ...tableProps } = table;
    return (
      <Block icon={icon} title={title}>
        <Table {...tableProps} />
      </Block>
    );
  })
  .add("Project Table", () => {
    const { icon, title, ...tableProps } = projectTable;
    return (
      <Block icon={icon} title={title}>
        <Table
          rowComponent={ProjectRow}
          paginationClickHandler={() => {}}
          {...tableProps}
        />
      </Block>
    );
  })
  .add("Text Node Table", () => {
    const { icon, title, text: singleText, headers } = textNodeTable;
    const {
      attributes: { toc, slug }
    } = singleText;
    return (
      <Block icon={icon} title={title}>
        <TextNodeTable headers={headers} slug={slug} rows={toc} />
      </Block>
    );
  })
  .add("Empty Table", () => {
    const { icon, title, ...tableProps } = projectTable;
    tableProps.rows = [];
    return (
      <Block icon={icon} title={title}>
        <Table
          rowComponent={ProjectRow}
          paginationClickHandler={() => {}}
          emptyMessage="This instance doesn’t have any projects yet."
          {...tableProps}
        />
      </Block>
    );
  });
