
export function login (req: any, res: any) {
    res.status(200).
    json({
    login: {
        username: req.body.username,
        password: req.body.password
    }
}); console.log(req.body)};

export function register (req: any, res: any) {
    res.status(200).
    json({
    register: 'register from controller auth'
})};

export function remove (req: any, res: any) {
    res.status(200).
    json({
        remove: 'remove from controller auth'
})};
