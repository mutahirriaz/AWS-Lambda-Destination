import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as destinations from "@aws-cdk/aws-lambda-destinations";
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sns from '@aws-cdk/aws-sns';
import * as iam from "@aws-cdk/aws-iam";
import * as apigw from "@aws-cdk/aws-apigateway";


export class LambdaWithDifferentDestinationsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const lambdaMainTopic = new sns.Topic(this, 'lambdaInvokeTopic')
    const myTopic = new sns.Topic(this, 'MySubTopic')

    const mainLambda = new lambda.Function(this, "mainLambda", {
      code: lambda.Code.fromAsset('lambda'),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      environment: {
        TOPIC_ARN: lambdaMainTopic.topicArn
      },
    });

    const failLambda = new lambda.Function(this, "lambdaFail", {
      code: lambda.Code.fromAsset('lambda'),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'fail.handler',
    });


    const destinedLambda = new lambda.Function(this, "destinedLambda", {
      code: lambda.Code.fromAsset('lambda'),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'destined.handler',
      retryAttempts: 1,
      onSuccess: new destinations.SnsDestination(myTopic),
      onFailure: new destinations.LambdaDestination(failLambda),
    })

    lambdaMainTopic.addSubscription(new subs.LambdaSubscription(destinedLambda))
    myTopic.addSubscription(new subs.EmailSubscription("mutahirriaz2@gmail.com"))


    mainLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sns:*"],
        resources: ["*"],
      })
    );

    const api = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: mainLambda,
    });

  }
}