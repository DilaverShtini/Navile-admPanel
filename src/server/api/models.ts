export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { model, floor, build } = body;
  
  try {
    let result;

    if (model === 'building') {
      result = prisma.building.groupBy({
        by: ['name', 'code', 'id'],
      });
    } else if (model === 'floor') {
      result = prisma.floor.groupBy({
        by: ['number', 'id'],
        where: {
            buildingId: parseInt(build)
        },
      });
    } else if (model === 'space') {
      result = prisma.space.groupBy({
        by: ['name'],
        where: {
            floorId: parseInt(floor)
        },
      });
    } else {
      throw new Error('Invalid model parameter');
    }

    return result;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Error fetching data');
  }
});
