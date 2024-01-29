export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);

        const { type } = body;

        if (!type) {
            console.error("Missing parameter");
            return null;
        }

        const ds = await prisma.dataSet.findMany({
            select:{
                data: true,
            },
            where: {
                type: type,
            },
        })

        if(type == 'Road') {
            const uniqueDataList = [...new Set(ds)];
            const uniqueDataJSON = JSON.stringify(uniqueDataList);
            return uniqueDataJSON;        
        } else {
            const dataList = ds.map(item => item.data?.data);
            const uniqueDataList = [...new Set(dataList)];
            const uniqueDataJSON = JSON.stringify(uniqueDataList);
            return uniqueDataJSON;
        }

    } catch(error) {
        console.error("Error getting data: ", error);
    }
})
