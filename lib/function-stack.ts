import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as node_lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import path = require('path');

export interface FunctionStackProps extends cdk.StackProps {
}

export class FunctionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FunctionStackProps) {
    super(scope, id, props);

    new node_lambda.NodejsFunction(this, 'stream-table', {
      bundling: {
        minify: true,
        sourceMap: true
      },
      entry: path.join(__dirname, "../funs/stream-table.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_16_X,
    });
  }
}

