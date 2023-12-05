export default defineEventHandler(() => {

    const space = prisma.space.groupBy({
        by: [ 'code' ],
    })
    return space;
});
