export class trainedModel
{
    public id: number;
    public data: [];
    public parameters: [];
    public evaluationData : {};

    constructor(id, parameters){
        this.id = id;
        this.parameters = parameters;
    }
}