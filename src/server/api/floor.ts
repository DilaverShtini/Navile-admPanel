export default defineEventHandler((buildingCode: string | null | undefined) => {
    const buildingCodeString = buildingCode ? String(buildingCode) : '';
    const buildingNumber = buildingCodeString.replace(/[^\d]/g, '');
    const buildingId = buildingNumber ? parseInt(buildingNumber, 10) : null;

    const floor = prisma.floor.groupBy({
        by: ['id', 'buildingId', 'number'],
        where: {
            buildingId: buildingId
        },
    });

    return floor;
});
