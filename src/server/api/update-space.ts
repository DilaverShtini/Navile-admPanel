export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { floorId, spaceId, spaceName, spaceDesc, spaceCapacity } = body;

    if (floorId !== null && spaceId!== null) {
        try {
            await prisma.space.update({
                where: {
                    id: parseInt(spaceId),
                },
                data: {
                    name: spaceName,
                    description: spaceDesc,
                    capacity: parseInt(spaceCapacity) !== null ? parseInt(spaceCapacity) : undefined,
                },
            });
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del record:', error);
        }
    }

    return {
        statusCode: 200,
        body: 'Operazione completata con successo',
    };
});
