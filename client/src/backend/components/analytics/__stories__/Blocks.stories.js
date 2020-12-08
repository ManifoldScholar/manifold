import React from "react";
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
  figure,
  figureList,
  time,
  list,
  table,
  projectTable,
  textNodeTable
} from "./sampleBlocks";
import { getData } from "./sampleData";

const dailyVisitors = getData("daily_visitors");
const returnVisits = getData("returning_visitors");
const averageVisit = getData("average_visit_duration");

storiesOf("Backend/Analytics/Block", module)
  .add("Chart", () => {
    const { icon, title, description } = chart;
    return (
      <Block icon={icon} title={title} description={description}>
        <Chart data={dailyVisitors.data} dataLabel="Visitors" />
      </Block>
    );
  })
  .add("Figure", () => {
    const { icon, title, stat, caption } = figure;
    return (
      <Block icon={icon} title={title}>
        <Figure stat={returnVisits.data.value} caption={caption} />
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
    const { title, minutes, seconds } = time;
    return (
      <Block icon="timerClock32" title={title}>
        <Time time={averageVisit.data.value} />
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
    const { icon, title, text, headers } = textNodeTable;
    const {
      attributes: { toc, slug }
    } = text;
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
