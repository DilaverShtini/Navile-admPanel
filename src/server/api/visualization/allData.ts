export default defineEventHandler(async () => {
    try {
        const uniqueDates = await prisma.dataset.findMany({
            distinct: ['date']
        });

        const monthCounts = uniqueDates.map(uniqueDate => {
            const month = new Date(uniqueDate.date).getMonth() + 1; // Il mese è 0-based, quindi aggiungo 1
            return { month, count: 1 }; // Inizializziamo il conteggio a 1 per ogni mese
        });

        // Raggruppiamo i conteggi per mese
        const aggregatedCounts = monthCounts.reduce((acc: any, { month, count }) => {
            acc[month] = (acc[month] || 0) + count;
            return acc;
        }, {});

        // Trasformiamo l'oggetto raggruppato in un array di oggetti
        const result = Object.entries(aggregatedCounts).map(([month, count]) => ({ month: parseInt(month), count }));

        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
});
