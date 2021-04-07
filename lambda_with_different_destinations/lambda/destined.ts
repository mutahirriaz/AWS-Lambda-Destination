exports.handler = async (event: any) => {

    console.log("Success Lambda Function ", event)

    return{
        data: "Destined Lambda Successful",
        success: true
    }

}