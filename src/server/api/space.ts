export default defineEventHandler((floorIdNumber: string | null | undefined) => {
    const floorCodeString = floorIdNumber ? String(floorIdNumber) : '';
    const idNumber = floorCodeString.replace(/[^\d]/g, '');
    const floor = idNumber ? parseInt(idNumber, 10) : null;
    const space = prisma.space.groupBy({
        by: ['code', 'name', 'description', 'capacity', 'legendId', 'floorId'],
        where: {
            floorId: floor
        },
    });
    return space;
});
