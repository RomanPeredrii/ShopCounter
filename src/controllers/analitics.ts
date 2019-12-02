export function getData (req: any, res: any) {
    res.status(200).
    json({
    login: 'getData from controller analitics'
})};

export function getPoints (req: any, res: any) {
    res.status(200).
    json({
        overview: 'getPoints from controller analitics'
})};