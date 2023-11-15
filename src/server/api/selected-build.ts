export default defineEventHandler((buildingId: string) => {
    const buildingCodeString = buildingId ? String(buildingId) : '';
    const buildingNumber = buildingCodeString.replace(/[^\d]/g, '');
    const buildId = parseInt(buildingNumber, 10);

    const build = prisma.building.findUnique({
        where: {
            id: buildId
        },
        select: {
            code: true,
            name: true,
            description: true,
        },
    });

    return build;
});
