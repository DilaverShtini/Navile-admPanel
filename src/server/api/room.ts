import { parse } from 'url';

export default defineEventHandler((spaceCode: string) => {
    const spaceCodeString = spaceCode ? String(spaceCode) : '';

    const parsedUrl = parse(spaceCodeString, true);
    const result = parsedUrl.query.spaceCode as string;

    const space = prisma.space.findFirst({
        where: {
            code: result
        },
        select: {
            id: true,
        },
    });
    return space;
});
