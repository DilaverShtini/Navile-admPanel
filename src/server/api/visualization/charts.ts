export default defineEventHandler(() => {
    const charts = prisma.dataset.groupBy({
        by: ['type'],
    })
    return charts
})
