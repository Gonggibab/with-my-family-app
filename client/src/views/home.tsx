import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
import { PostAPI } from 'api/PostAPI';
import { MediaAPI } from 'api/MediaAPI';
import { DdabongAPI } from 'api/DdabongAPI';
import Post from 'components/Home/Post';
import { AiFillFileAdd } from 'react-icons/ai';

import styles from 'styles/views/Home.module.scss';

export type MediaData = {
  url: string;
  type: string;
};

type DdabongData = {
  ddabongId: string;
  userId: string;
  name: string;
};

type postData = {
  postId: string;
  userId: string;
  name: string;
  relationship?: string;
  profile: string;
  media: MediaData[];
  ddabongList: DdabongData[];
  content: string;
  updatedAt: string;
};

export type PostProps = {
  post: postData;
  posts: postData[];
  setPosts: React.Dispatch<React.SetStateAction<postData[]>>;
};

export default function Home() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const families = useSelector((state: RootState) => state.user.families);
  const [posts, setPosts] = useState<postData[]>([]);

  useEffect(() => {
    if (families.length !== 0) {
      fetchFamilyPosts();
    }
  }, [families]);

  const fetchFamilyPosts = async () => {
    try {
      dispatch(setIsLoading(true));
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

        const ddabongList = [];
        const ddabongRes = await DdabongAPI.getDdabongByPost(post._id);
        for (const ddabong of ddabongRes.data.ddabong) {
          ddabongList.push({
            ddabongId: ddabong._id,
            userId: ddabong.userId._id,
            name: ddabong.userId.name,
          });
        }

        postList.push({
          postId: post._id,
          userId: post.userId._id,
          name: post.userId.name,
          relationship: relationship,
          profile: post.userId.profile,
          media: mediaList,
          ddabongList: ddabongList,
          content: post.content,
          updatedAt: post.updatedAt,
        });
      }
      setPosts(postList);
      dispatch(setIsLoading(false));
    } catch (err) {
      console.log('오류가 발생했습니다. 다시 시도해 주세요. ' + err);
    }
  };

  const postComponents = posts.map((post: postData) => {
    return (
      <Post key={post.postId} post={post} posts={posts} setPosts={setPosts} />
    );
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
