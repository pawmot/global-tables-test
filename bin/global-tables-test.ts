#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GlobalTableStack } from '../lib/global-table-stack';
import { FunctionStack } from '../lib/function-stack';

const app = new cdk.App();
const globalTableStack = new GlobalTableStack(app, 'GlobalTableStack', {
  env: {
    region: 'eu-west-1'
  },
});

/*new FunctionStack(app, 'FunctionStackIreland', {
  env: {
    region: 'eu-west-1'
  },
  crossRegionReferences: true
});*/

/*new FunctionStack(app, 'FunctionStackFrankfurt', {
  table: globalTableStack.table,
  env: {
    region: 'eu-central-1',
  },
  crossRegionReferences: true
});*/

