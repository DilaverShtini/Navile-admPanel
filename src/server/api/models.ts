export default defineEventHandler((model: String | null | undefined,
                                          floor: String | null | undefined,
                                          build: String | null | undefined) => {
  /*try {

    if (model === 'building') {
      const buildingResult = prisma.building.groupBy({
        by: ['code'],
      });
      return buildingResult;
    } else if (model === 'floor') {
      const floorResult = prisma.floor.groupBy({
        by: ['number'],
        where: {
            buildingId: build
        },
      });
      return floorResult
    } else if (model === 'space') {
      const spaceResult = prisma.space.groupBy({
        by: ['name'],
        where: {
            floorId: numberfloor
        },
      });
      return spaceResult;
    }

    throw new Error('Invalid model parameter');

  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Error fetching data');
  }*/
});
