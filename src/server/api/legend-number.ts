export default defineEventHandler((event) => {
    try {
        const url = event.node.req.url;

        if(url) {
            const legendNameQueryParam = url.split("=")[1];
            
            if (!legendNameQueryParam) {
                throw new Error("Missing 'legendName' parameter in the URL.");
            }
            
            const legend = prisma.legend.findFirst({
                where: {
                    name: legendNameQueryParam
                },
                select: {
                    id: true,
                },
            });

            return legend;
        }
        return null
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
});
