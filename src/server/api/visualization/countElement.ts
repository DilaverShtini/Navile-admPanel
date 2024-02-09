export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);

        const { type, data } = body;

        if (!type) {
            console.error("Missing parameter");
            return null;
        }

        const ds = await prisma.dataset.count({
            where: {
                type: type,
                data: {
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
