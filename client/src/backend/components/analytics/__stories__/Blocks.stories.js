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

storiesOf("Backend/Analytics/Block", module)
  .add("Chart", () => {
    const { icon, title, description, series, options } = chart;
    return (
      <Block icon={icon} title={title} description={description}>
        <Chart series={series} options={options} />
      </Block>
    );
  })
  .add("Figure", () => {
    const { icon, title, stat, caption } = figure;
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
    const { title, minutes, seconds } = time;
    return (
      <Block icon="timerClock32" title={title}>
        <Time minutes={minutes} seconds={seconds} />
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
