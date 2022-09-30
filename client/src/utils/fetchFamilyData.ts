import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { setFamilies } from 'redux/_slices/userSlice';
import { RelationshipAPI } from 'api/RelationshipAPI';

const fetchFamilyData = async (
  userId: string,
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const relationRes = await RelationshipAPI.getRelationship(userId);
    const relationList = [];
    for (const relation of relationRes.data.relationship) {
      relationList.push({
        relationId: relation._id,
        userId: relation.familyId._id,
        name: relation.familyId.name,
        profile: relation.familyId.profile,
        relationship: relation.relationship,
      });
    }
    dispatch(setFamilies(relationList));
  } catch (err) {
    console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
  }
};

export default fetchFamilyData;
