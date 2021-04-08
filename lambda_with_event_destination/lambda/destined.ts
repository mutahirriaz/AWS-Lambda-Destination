exports.handler = async (event: any) => {

    console.log("Success Lambda Function ", event)

    return{
        data: "Success-topic",
        success: true
    }

}