export default defineEventHandler((legendId: string) => {
    const legendIdString = legendId ? String(legendId) : '';
    const legendIdNumber = legendIdString.replace(/[^\d]/g, '');
    const legend = parseInt(legendIdNumber, 10);

    const result = prisma.legend.findUnique({
        where: {
            id: legend
        },
        select: {
            name: true,
        },
    });

    return result;
});
