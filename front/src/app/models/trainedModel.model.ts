export class trainedModel
{
    public id: number;
    public data: [];
    public parameters: [];

    constructor(id, parameters){
        this.id = id;
        this.parameters = parameters;
    }
}