export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { type, nameField, startPoint, endPoint} = body;

        if (type == "Road") {
            const datasets = await prisma.dataset.findMany({
                where: {
                    type: type,
                    data: {
                        equals: JSON.stringify([{ start: startPoint }, { end: endPoint }])
                    }
                },
            })

            const aggregatedCounts: { [month: number]: number } = {};

            datasets.forEach(dataset => {
                const month = new Date(dataset.date).getMonth() + 1; // Il mese è 0-based, quindi aggiungo 1
                aggregatedCounts[month] = (aggregatedCounts[month] || 0) + 1; // Incrementa il conteggio per il mese corrente
            });
    
            const result = Object.entries(aggregatedCounts).map(([month, count]) => ({
                month: parseInt(month),
                count
            }));

            return result;
        } else {
            const datasets = await prisma.dataset.findMany({
                where: {
                    type: type,
                    data: {
                        equals: nameField
                    }
                }
            });

            const aggregatedCounts: { [month: number]: number } = {};

            datasets.forEach(dataset => {
                const month = new Date(dataset.date).getMonth() + 1; // Il mese è 0-based, quindi aggiungo 1
                aggregatedCounts[month] = (aggregatedCounts[month] || 0) + 1; // Incrementa il conteggio per il mese corrente
            });
    
            const result = Object.entries(aggregatedCounts).map(([month, count]) => ({
                month: parseInt(month),
                count
            }));

            return result;
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
});
