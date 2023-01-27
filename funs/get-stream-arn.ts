import { CloudFormationCustomResourceEvent, CloudFormationCustomResourceResponse } from "aws-lambda";
import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { v4 } from 'uuid';

export const handler = async (event: CloudFormationCustomResourceEvent): Promise<CloudFormationCustomResourceResponse> => {
  console.log(event);

  switch (event.RequestType) {
    case 'Update':
    case 'Create':
      return await createOrUpdate(event);
    case 'Delete':
      return {
        Status: 'SUCCESS',
        Reason: 'Deleting',
        StackId: event.StackId,
        LogicalResourceId: event.LogicalResourceId,
        RequestId: event.RequestId,
        PhysicalResourceId: event.PhysicalResourceId
      }
  }
}

const createOrUpdate = async (event: CloudFormationCustomResourceEvent): Promise<CloudFormationCustomResourceResponse> => {
  const tableName = event.ResourceProperties.TableName;

  const dynamodb = new DynamoDBClient({});
  const table = await dynamodb.send(new DescribeTableCommand({ TableName: tableName }));

  return {
    Status: 'SUCCESS',
    PhysicalResourceId: v4(),
    StackId: event.StackId,
    LogicalResourceId: event.LogicalResourceId,
    RequestId: event.RequestId,
    Data: {
      StreamArn: table.Table?.LatestStreamArn
    }
  }
}
