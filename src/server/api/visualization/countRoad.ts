export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);

        const { type, startPoint, endPoint } = body;

        if (!type || !startPoint || !endPoint) {
            console.error("Missing parameter");
            return null;
        }

        var json = [{ start: startPoint }, { end: endPoint }]

        const ds = await prisma.dataSet.count({
            where: {
                type: type,
                data: {
                    equals: json,
                }
            },
        })

        //console.log("count element: ", ds);

        return ds;
    } catch(error) {
        console.error("Error getting data: ", error);
        return ;
    }
})
