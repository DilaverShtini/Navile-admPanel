export default defineEventHandler(() => {
    const models = Object.keys(prisma);
    const filteredModels = models.filter(model => !model.startsWith('_') && !model.startsWith('$'));  
    return filteredModels
})
