export default defineEventHandler(() => {
    const building = prisma.building.groupBy({
        by: ['id', 'code', 'name', 'description'],
    })
    return building
})
