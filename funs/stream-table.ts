import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  console.log(`Got a message: ${JSON.stringify(event)}`);
}

