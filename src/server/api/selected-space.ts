export default defineEventHandler((spaceStringId: string) => {
    const spaceCodeString = spaceStringId ? String(spaceStringId) : '';
    const spaceNumber = spaceCodeString.replace(/[^\d]/g, '');
    const spaceId = parseInt(spaceNumber, 10);

    const space = prisma.space.findUnique({
        where: {
            id: spaceId
        },
        select: {
            name: true,
            description: true,
            capacity: true,
        },
    });

    return space;
});
