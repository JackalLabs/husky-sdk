import GenericObject from "../IGenericObject";
import NodeUploadResponse from "./INodeUploadResponse";

export default interface NodeResponse {
    jcode: number,
    status?: string,
    message?: string,
    data?: NodeUploadResponse | GenericObject
}