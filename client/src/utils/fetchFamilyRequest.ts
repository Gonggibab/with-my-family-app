import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { setFamilyRequests } from 'redux/_slices/userSlice';
import { FamilyRequestAPI } from 'api/FamilyRequestAPI';

const fetchFamilyRequest = async (
  userId: string,
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const reqRes = await FamilyRequestAPI.getFamilyRequest(userId);
    const requestList = [];
    for (const request of reqRes.data.request) {
      requestList.push({
        requestId: request._id,
        requesterId: request.requesterId._id,
        name: request.requesterId.name,
        profile: request.requesterId.profile,
      });
    }
    dispatch(setFamilyRequests(requestList));
  } catch (err) {
    console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
  }
};

export default fetchFamilyRequest;
