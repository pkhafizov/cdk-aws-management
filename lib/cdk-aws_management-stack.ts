import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda')
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets'
import {Role,ServicePrincipal,ManagedPolicy} from '@aws-cdk/aws-iam';

export class CdkAwsManagementStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ec2ManageRole = new Role(this,'ec2ManagRole',{
      assumedBy: new ServicePrincipal('lambda.amazonaws.com')
    });

    ec2ManageRole.addManagedPolicy(ManagedPolicy.fromManagedPolicyName(this,'ec2StartStop','EC2StartStop'));

    const startStopEC2Func = new lambda.Function(this, 'StartStopEC2Func', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.asset('lambda'),
      handler: 'start-stop.lambdaHandler',
      role: ec2ManageRole
    });

    const lambdaTarget = new LambdaFunction(startStopEC2Func);

    new Rule(this,'ScheduleStop',{
      schedule: Schedule.cron({minute:'32',hour:'18'}),
      targets:[lambdaTarget]
    });    
  }
}
