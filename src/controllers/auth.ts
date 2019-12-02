
export function login (req: any, res: any) {
    res.status(200).
    json({
    login: 'true from controller auth'
})};

export function register (req: any, res: any) {
    res.status(200).
    json({
    register: 'register from controller auth'
})};

export function remove (req: any, res: any) {
    res.status(200).
    json({
    register: 'remove from controller auth'
})};
