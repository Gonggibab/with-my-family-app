import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { setIsLoading } from 'redux/_slices/appSlice';
import { PostAPI } from 'api/PostAPI';
import { MediaAPI } from 'api/MediaAPI';
import { DdabongAPI } from 'api/DdabongAPI';
import Post from 'components/Home/Post';
import { AiFillFileAdd } from 'react-icons/ai';

import styles from 'styles/views/Home.module.scss';
import { RelationshipAPI } from 'api/RelationshipAPI';

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
  const navigate = useNavigate();
  const loadCount = useRef<number>(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLogin = useSelector((state: RootState) => state.user.isLogin);
  const user = useSelector((state: RootState) => state.user.user);
  const families = useSelector((state: RootState) => state.user.families);
  const [posts, setPosts] = useState<postData[]>([]);
  const [isNoFamily, setIsNoFamily] = useState<boolean>(false);

  useEffect(() => {
    loadCount.current = 0;
    setPosts([]);
    const observer = new IntersectionObserver((entries) => {
      if (loadCount.current !== -1 && loadCount.current > 0) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchFamilyPosts(5);
          }
        });
      }
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user._id) {
      dispatch(setIsLoading(true));
      fetchFamilyPosts(5);
      dispatch(setIsLoading(false));
    }
  }, [user._id]);

  const fetchFamilyPosts = async (loadSize: number) => {
    try {
      const relationRes = await RelationshipAPI.getRelationship(user._id);
      const familyIdList = relationRes.data.relationship.map(
        (relation: any) => relation.familyId
      );

      if (familyIdList.length === 0) {
        setIsNoFamily(true);
        return;
      }

      const postRes = await PostAPI.getFamilyPost({
        userIdList: familyIdList,
        size: loadSize,
        load: loadCount.current,
      });

      const posts = postRes.data.posts;
      if (posts.length === loadSize) {
        loadCount.current += 1;
      } else {
        loadCount.current = -1;
      }

      const postList: postData[] = [];
      for (const post of posts) {
        let relationship;
        for (const family of families) {
          if (family.userId === post.userId._id) {
            relationship = family.relationship;
          }
        }
        const mediaList = [];
        const mediaRes = await MediaAPI.getByPost(post._id);
        for (const media of mediaRes.data.media) {
          mediaList.push({
            url: `http://localhost:5000/${media.filePath}`,
            type: media.mimeType,
          });
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
      setPosts((posts) => [...posts, ...postList]);
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
      {!isNoFamily ? (
        <>
          {postComponents}
          <div className={styles.scrollObserver} ref={bottomRef} />
          {isLogin && (
            <Link className={styles.addPostBtn} to={'/addPost'}>
              <AiFillFileAdd />
              <span>글 쓰기</span>
            </Link>
          )}
        </>
      ) : (
        <div className={styles.addFamilyRecommendation}>
          <h3>표시할 게시물이 없습니다</h3>
          <h4>가족을 추가해 게시물을 찾아보세요</h4>
          <button onClick={() => navigate('family')}>가족 페이지로</button>
        </div>
      )}
    </div>
  );
}
