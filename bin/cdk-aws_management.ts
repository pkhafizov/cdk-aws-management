#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkAwsManagementStack } from '../lib/cdk-aws_management-stack';

const app = new cdk.App();
new CdkAwsManagementStack(app, 'CdkAwsManagementStack');
