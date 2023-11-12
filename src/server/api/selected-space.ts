export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { spaceId } = body;

    let result = null
    if (spaceId!==null) {
        try {
            result = await prisma.space.groupBy({
                by: ['name', 'description', 'capacity'],
                where: {
                    id: parseInt(spaceId),
                },
            });
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del record:', error);
        }
    }

    return result
});
