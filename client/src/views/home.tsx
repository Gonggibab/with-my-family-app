import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
import { PostAPI } from 'api/PostAPI';
import Post from 'components/Home/Post';
import { AiFillFileAdd } from 'react-icons/ai';

import styles from 'styles/views/Home.module.scss';
import { MediaAPI } from 'api/MediaAPI';

type postData = {
  postId: string;
  userId: string;
  name: string;
  relationship?: string;
  profile: string;
  media: Media[];
  content: string;
  updatedAt: string;
};

export type Media = {
  url: string;
  type: string;
};

export type PostProps = {
  post: postData;
};

export default function Home() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const families = useSelector((state: RootState) => state.user.families);
  const [posts, setPosts] = useState<postData[]>([]);

  useEffect(() => {
    dispatch(setIsLoading(true));
    if (families.length !== 0) {
      fetchFamilyPosts();
    }
    dispatch(setIsLoading(false));
  }, [families]);

  const fetchFamilyPosts = async () => {
    const familyIdList = [];
    for (const family of families) {
      familyIdList.push(family.userId);
    }

    const postRes = await PostAPI.getRecentPost(familyIdList);
    const postList = [];
    for (const post of postRes.data.posts) {
      let relationship;
      for (const family of families) {
        if (family.userId === post.userId._id) {
          relationship = family.relationship;
        }
      }
      const mediaList = [];
      const mediaRes = await MediaAPI.getByPost(post._id);
      for (const media of mediaRes.data.media) {
        mediaList.push({ url: media.filePath, type: media.mimeType });
      }

      postList.push({
        postId: post._id,
        userId: post.userId._id,
        name: post.userId.name,
        relationship: relationship,
        profile: post.userId.profile,
        media: mediaList,
        content: post.content,
        updatedAt: post.updatedAt,
      });
    }
    setPosts(postList);
  };

  const postComponents = posts.map((post: postData) => {
    return <Post key={post.postId} post={post} />;
  });

  return (
    <div className={styles.container}>
      {postComponents}
      {isLogin && (
        <Link className={styles.addPostBtn} to={'/addPost'}>
          <AiFillFileAdd />
          <span>글 쓰기</span>
        </Link>
      )}
    </div>
  );
}
