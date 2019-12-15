interface IinputErrorParams {
    message?: string,
    status?: number,
    error?: Error | string
};

interface IerrorH {
    response: Response,
    e?: IinputErrorParams;
    init(): void
};

export default class myErrorHandler implements IerrorH {
    response: Response;
    message: string;
    status: number;
    error: Error;

    constructor(res: Response, e: IinputErrorParams) {
        this.response = res;
        this.status = e.status ? e.status : 500;
        this.message = e.message ? e.message : `Internal sever error`;
        this.error = (e.error instanceof Error) ? e.error : new Error(this.message);
        this.init();
    }

    init(): void {
        this.error.message = this.message 
        //@ts-ignore
        console.log('this.error.message', this.error.message);
        this.response
            //@ts-ignore
            .status(this.status)
            //@ts-ignore
            .json({ message: this.error.message });
    }
};
