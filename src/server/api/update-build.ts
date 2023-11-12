export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { buildingId, buildingCode, buildingName, buildingDesc } = body;

    if (buildingCode !== null) {
        try {
            await prisma.building.update({
                where: {
                    id: parseInt(buildingId),
                },
                data: {
                    name: buildingName,
                    description: buildingDesc,
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
