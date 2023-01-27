import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export class GlobalTableStack extends cdk.Stack {
  public table: dynamodb.ITable;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*const table = new dynamodb.CfnGlobalTable(this, 'GlobalTable', {
      keySchema: [{
        attributeName: 'id',
        keyType: 'HASH'
      }],
      attributeDefinitions: [{
        attributeName: 'id',
        attributeType: 'S'
      }],
      replicas: [{
        region: 'eu-west-1'
      }, {
        region: 'eu-central-1'
      }],
      billingMode: 'PAY_PER_REQUEST',
      streamSpecification: {
        streamViewType: 'NEW_AND_OLD_IMAGES'
      }
    });*/

    const table = new dynamodb.Table(this, 'GlobalTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      replicationRegions: ['eu-central-1'],
    });

    table.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}

