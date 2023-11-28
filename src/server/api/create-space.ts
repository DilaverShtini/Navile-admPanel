import * as fs from 'fs/promises';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        const { code, buildCode, floorNumber, name, description, floorId, legendId, capacity } = body;
        if (!buildCode || !floorNumber || !name) {
            console.error("Missing parameter");
            return null;
        }

        const newCode = `${buildCode}_${floorNumber}_${code}`;

        const space = await prisma.space.create({
            data: {
                code: newCode,
                name: name,
                description: description,
                floorId: parseInt(floorId),
                legendId: parseInt(legendId),
                capacity: parseInt(capacity) !== null ? parseInt(capacity) : undefined,
            },
        });

        const jsonData = await fs.readFile('prisma/data/spaces.json', 'utf-8');
        const spacesArray = JSON.parse(jsonData);

        spacesArray.push({
            id: space.id,
            code: space.code,
            name: space.name,
            description: space.description,
            floorId: space.floorId,
            legendId: space.legendId,
        });

        await fs.writeFile('prisma/data/spaces.json', JSON.stringify(spacesArray, null, 2), 'utf-8');

        return space;
    } catch (error) {
        console.error("Error creating space:", error);
    }
});
