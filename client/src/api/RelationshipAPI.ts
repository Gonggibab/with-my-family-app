import HttpRequest from 'api/HttpRequest';

export type RelationshipDataType = {
  user1Id: string;
  user2Id: string;
};

export type RelationUpdateDataType = {
  relationId: string;
  relationship: string;
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
  updateRelationship: (data: RelationUpdateDataType) => {
    return HttpRequest.post('/api/relationShip/updateRelationship', {
      data,
    });
  },
};
