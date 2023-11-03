export default defineEventHandler(() => {
    const models = Object.keys(prisma);
    const modifiedModels = ['building', 'space'];
    const filteredModels = models.filter(model => !model.startsWith('_')
                                            && !model.startsWith('$') 
                                            && modifiedModels.includes(model.toLowerCase()));
    return filteredModels
})
