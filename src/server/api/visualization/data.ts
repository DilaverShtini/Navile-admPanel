export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);

        const { type } = body;

        if (!type) {
            console.error("Missing parameter");
            return null;
        }

        const ds = await prisma.dataSet.findMany({
            where: {
                type: type
            },
        })

        return ds;
    } catch(error) {
        console.error("Error getting data: ", error);
    }
})
