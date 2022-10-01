import HttpRequest from 'api/HttpRequest';

export type RelationshipDataType = {
  user1Id: string;
  user2Id: string;
};

export const RelationshipAPI = {
  addRelationship: (data: RelationshipDataType) => {
    return HttpRequest.post('/api/relationShip/addRelationship', data);
  },
  getRelationship: (userId: string) => {
    return HttpRequest.post('/api/relationShip/getRelationship', { userId });
  },
  countRelationship: (userId: string) => {
    return HttpRequest.post('/api/relationShip/countRelationship', { userId });
  },
  deleteRelationship: (relationId: string) => {
    return HttpRequest.post('/api/relationShip/deleteRelationship', {
      relationId,
    });
  },
};
