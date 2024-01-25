import httpClient from 'http/httpClient';
import {
  AddSGMaterial,
  AddSGMaterialResponse,
  DeleteSGMaterialResposne,
  ISGMaterialMaintenance,
  ReshufflePriority,
  SGMaterialMaintenanceList,
} from 'types/siliconGradeMaterialMaintenance.model';

const SiliconGradeMaterialMaintenanceService = (): ISGMaterialMaintenance => {
  return {
    getSGMaterialMaintenanceList: (): HttpPromise<SGMaterialMaintenanceList> => {
      return httpClient.get(`/api/silicon-grade/crud/`);
    },
    getSGMaterial: (id: string): HttpPromise<SGMaterialMaintenanceList> => {
      return httpClient.get(`/api/silicon-grade/crud/${id}/`);
    },
    addSGMaterial: (request: AddSGMaterial): HttpPromise<AddSGMaterialResponse> => {
      return httpClient.post(`/api/silicon-grade/crud/`, { data: request });
    },
    updateSGMaterial: (request: AddSGMaterial): HttpPromise<AddSGMaterialResponse> => {
      return httpClient.put(`/api/silicon-grade/crud/`, { data: request });
    },
    deleteSGMaterial: (id: string): HttpPromise<DeleteSGMaterialResposne> => {
      return httpClient.delete(`/api/silicon-grade/delete/${id}/`);
    },
    reshufflePriority: (request: ReshufflePriority): HttpPromise<DeleteSGMaterialResposne> => {
      return httpClient.put(`/api/silicon-grade/shuffle/`, { data: request });
    },
  };
};

export default SiliconGradeMaterialMaintenanceService();
