var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ec2 = new AWS.EC2({apiVersion:'2016-11-15'});

exports.lambdaHandler = async(event, context) => {
    var paramsDescribe = {};
    let instanceIds = [];
    try {
        const data = await ec2.describeInstances(paramsDescribe).promise();
        for (const reservation of data.Reservations){
            for(let instance of reservation.Instances) {
                instanceIds.push(instance.InstanceId);
            }
            
        }
    } catch (error) {
        console.log(error);
    }

    var params = {
        InstanceIds: instanceIds,
        DryRun: false
    };

    try {
        await ec2.stopInstances(params).promise();
    } catch (error) {
        console.log(error);
    }
    return instanceIds;
};