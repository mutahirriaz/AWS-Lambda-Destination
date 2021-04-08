exports.handler = async (event: any) => {
    console.log(event);
    return{
        data: "Failure Lambda"
    }
}