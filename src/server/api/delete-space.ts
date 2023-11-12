export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { id } = body;

        if (!id) {
            console.error('Error in deleteOperation');
            return null;
        }

        const response = await prisma.space.delete({
            where: {
                id: id
            },
        });

        return response;
    } catch (error) {
        console.error('Error in delete-space handler:', error);
    }
});
