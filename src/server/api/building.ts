export default defineEventHandler(() => {
    const building = prisma.building.groupBy({
        by: ['code', 'name', 'description'],
    })
    return building
})
