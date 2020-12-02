import React from "react";
import { storiesOf } from "helpers/storybook/exports";
import { select } from "@storybook/addon-knobs";
import Block, {
  Chart,
  Figure,
  Grid,
  List,
  Table,
  Time,
  ProjectRow
} from "backend/components/analytics";
import { chart, figure, time, list, table, projectTable } from "./sampleBlocks";

storiesOf("Backend/Analytics/Grid", module).add("Sample Grid", () => {
  const columns = select(
    "Columns (on desktop)",
    {
      2: 2,
      3: 3,
      4: 4
    },
    4
  );
  return (
    <Grid columns={columns}>
      <Block
        width={100}
        icon={chart.icon}
        title={chart.title}
        description={chart.description}
      >
        <Chart series={chart.series} options={chart.options} />
      </Block>
      <Block width={25} icon={figure.icon} title={figure.title}>
        <Figure stat={figure.stat} caption={figure.caption} />
      </Block>
      <Block width={25} icon="timerClock32" title={time.title}>
        <Time minutes={time.minutes} seconds={time.seconds} />
      </Block>
      <Block width={25} icon="resourceInteractive64" title="Interaction">
        <Figure stat="18%" caption="46 visitors used annotations or comments" />
      </Block>
      <Block width={25} icon="bookmark32" title="Followed">
        <Figure
          stat="6"
          caption="Average number of followed projects for each visitor"
        />
      </Block>
      <Block
        width={100}
        icon={list.icon}
        title={list.title}
        description={list.description}
      >
        <List items={list.items} />
      </Block>
      <Block width={50} icon={projectTable.icon} title={projectTable.title}>
        <Table
          headers={projectTable.headers}
          rowComponent={ProjectRow}
          rows={projectTable.rows}
          allLink="testUrl"
        />
      </Block>
      <Block width={50} icon={table.icon} title={table.title}>
        <Table {...table} />
      </Block>
    </Grid>
  );
});
