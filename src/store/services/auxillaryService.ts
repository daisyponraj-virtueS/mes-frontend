import httpClient from 'http/httpClient';
import {
  GetAllAuxillaryResponse,
  AuxillaryService as IAuxillaryService,
} from 'types/auxillary.model';

const AuxillaryService = (): IAuxillaryService => {
  return {
    getAllAuxillaryList: (): HttpPromise<GetAllAuxillaryResponse> => {
      return httpClient.get('/api/elementmaster/?element_type=2');
    },
  };
};

export default AuxillaryService();
