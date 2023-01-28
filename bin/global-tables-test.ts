#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GlobalTableStack } from '../lib/global-table-stack';
import { FunctionStack } from '../lib/function-stack';

const app = new cdk.App();
const tableName = "GlobalTable";
const globalTableStack = new GlobalTableStack(app, 'GlobalTableStack', {
  env: {
    region: 'eu-west-1'
  },
  tableName
});

new FunctionStack(app, 'FunctionStackIreland', {
  env: {
    region: 'eu-west-1',
  },
  tableName,
});

new FunctionStack(app, 'FunctionStackFrankfurt', {
  env: {
    region: 'eu-central-1',
  },
  tableName,
});

new FunctionStack(app, 'FunctionStackNorthernVirginia', {
  env: {
    region: 'us-east-1',
  },
  tableName,
});

new FunctionStack(app, 'FunctionStackSydney', {
  env: {
    region: 'ap-southeast-2',
  },
  tableName,
});

