export default defineEventHandler(() => {
    const legend = prisma.legend.groupBy({
        by: ['name'],
    })
    return legend
})
