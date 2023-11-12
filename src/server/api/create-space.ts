export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        const { buildCode, floorNumber, name, description, floorId, legendId, capacity } = body;
        if (!buildCode || !floorNumber || !name) {
            console.error("Missing parameter");
            return null;
        }

        const code = `${buildCode}_${floorNumber}_${name.replace(/\s/g, '')}`;

        const space = await prisma.space.create({
            data: {
                code: code,
                name: name,
                description: description,
                floorId: parseInt(floorId),
                legendId: parseInt(legendId),
                capacity: parseInt(capacity) !== null ? parseInt(capacity) : undefined,
            },
        });

        return space;
    } catch (error) {
        console.error("Error creating space:", error);
    }
});
