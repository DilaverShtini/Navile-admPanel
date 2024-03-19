export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);

        const { type } = body;

        if (!type) {
            console.error("Missing parameter");
            return null;
        }

        const ds = await prisma.dataset.findMany({
            select:{
                data: true,
            },
            where: {
                type: type,
            },
        })

        if(type == 'Road') {
            const uniqueDataList = Array.from(new Set(ds.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
            console.log("data list: ", uniqueDataList)
            const uniqueDataJSON = JSON.stringify(uniqueDataList);
            return uniqueDataJSON;        
        } else {
            const dataList = ds.map(item => item.data);
            const uniqueDataList = [...new Set(dataList)];
            const uniqueDataJSON = JSON.stringify(uniqueDataList);

            return uniqueDataJSON;
        }

    } catch(error) {
        console.error("Error getting data: ", error);
    }
})
