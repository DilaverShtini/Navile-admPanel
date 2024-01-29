export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);

        const { data } = body;

        if (!data) {
            console.error("Missing parameter");
            return null;
        }

        const ds = await prisma.dataSet.count({
            where: {
                type: 'Button',
                data: {
                    path: '$.data',
                    equals: data,
                }
            },
        })

        return ds;
    } catch(error) {
        console.error("Error getting data: ", error);
        return ;
    }
})
