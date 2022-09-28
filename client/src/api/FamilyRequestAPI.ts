import HttpRequest from 'api/HttpRequest';

export type FamilyRequestDataType = {
  requesterId: string;
  requesteeId: string;
};

export const FamilyRequestAPI = {
  sendFamilyRequest: (data: FamilyRequestDataType) => {
    return HttpRequest.post('/api/familyRequest/sendRequest', data);
  },
  getFamilyRequest: (userId: string) => {
    return HttpRequest.post('/api/familyRequest/getRequest', { userId });
  },
};
