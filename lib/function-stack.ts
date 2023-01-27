import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as node_lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as customResource from 'aws-cdk-lib/custom-resources';
import path = require('path');

export interface FunctionStackProps extends cdk.StackProps {
  tableName: string;
}

export class FunctionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FunctionStackProps) {
    super(scope, id, props);

    const getStreamArnFn = new node_lambda.NodejsFunction(this, 'get-stream-arn', {
      bundling: {
        minify: true,
        sourceMap: true
      },
      entry: path.join(__dirname, "../funs/get-stream-arn.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_16_X
    });

    getStreamArnFn.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:DescribeTable'],
      resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${props.tableName}`]
    }));

    const provider = new customResource.Provider(this, 'provider', {
      onEventHandler: getStreamArnFn
    });

    const streamArnResource = new cdk.CustomResource(this, 'stream-arn-resource', {
      serviceToken: provider.serviceToken,
      properties: {
        TableName: props.tableName
      }
    });

    const fn = new node_lambda.NodejsFunction(this, 'stream-table', {
      bundling: {
        minify: true,
        sourceMap: true
      },
      entry: path.join(__dirname, "../funs/stream-table.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_16_X
    });

    new lambda.EventSourceMapping(this, 'event-source-mapping', {
      eventSourceArn: streamArnResource.getAttString('StreamArn'),
      target: fn,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      batchSize: 1,
    });

    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:DescribeStream', 'dynamodb:GetRecords', 'dynamodb:GetShardIterator', 'dynamodb:ListStreams'],
      resources: [streamArnResource.getAttString('StreamArn')]
    }));
  }
}

