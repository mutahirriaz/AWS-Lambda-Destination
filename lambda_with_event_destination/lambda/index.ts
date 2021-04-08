 
import * as AWS from 'aws-sdk'

exports.handler = async (event: any) => {
    console.log("Event in main function = ", event)
    const topic = new AWS.SNS();


    await topic.publish({
        Message: JSON.stringify({
            data: "Hello World",
            success: event.data
        }),
        TopicArn: process.env.TOPIC_ARN
    }).promise()



    return {
        data: "Hello World"
    }
}