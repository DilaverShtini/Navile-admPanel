export default defineEventHandler(() => {
    const charts = prisma.dataSet.groupBy({
        by: ['type'],
    })
    return charts
})
