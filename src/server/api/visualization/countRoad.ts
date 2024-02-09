export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);

        const { type, startPoint, endPoint } = body;

        if (!type || !startPoint || !endPoint) {
            console.error("Missing parameter");
            return null;
        }

        //var json = [{ start: startPoint }, { end: endPoint }]

        const ds = await prisma.dataset.count({
            where: {
                type: type,
                data: {
                    equals: JSON.stringify([{ start: startPoint }, { end: endPoint }])
                }
            },
        })

        return ds;
    } catch(error) {
        console.error("Error getting data: ", error);
        return ;
    }
})
