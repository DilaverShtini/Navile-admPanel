import * as fs from 'fs/promises';

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

        const jsonData = await fs.readFile('prisma/data/spaces.json', 'utf-8');
        const spacesArray = JSON.parse(jsonData);

        const indexToRemove = spacesArray.findIndex(space => space.id === id);

        if (indexToRemove !== -1) {
            spacesArray.splice(indexToRemove, 1);
            await fs.writeFile('prisma/data/spaces.json', JSON.stringify(spacesArray, null, 2), 'utf-8');
        }

        return response;
    } catch (error) {
        console.error('Error in delete-space handler:', error);
    }
});
