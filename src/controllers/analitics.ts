export function getData(req: any, res: any) {
  res.json({
    login: "getData from controller analitics"
  });
}

export function getPoints(req: any, res: any) {
  res.json({
    overview: "getPoints from controller analitics"
  });
}
