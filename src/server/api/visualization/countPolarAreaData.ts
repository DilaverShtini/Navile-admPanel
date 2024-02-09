export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);

        const { data } = body;

        if (!data) {
            console.error("Missing parameter");
            return null;
        }

        const parsedData = JSON.parse(data)
        const buttonName = parsedData.data

        const ds = await prisma.dataset.count({
            where: {
                type: 'Button',
                data: { 
                    contains: buttonName
                },
            },
        })

        return ds;
    } catch(error) {
        console.error("Error getting data: ", error);
        return ;
    }
})
