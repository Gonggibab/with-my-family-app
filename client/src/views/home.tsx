import Post from 'components/Home/Post';
import { AiFillFileAdd } from 'react-icons/ai';
import { Link } from 'react-router-dom';

import styles from 'styles/views/Home.module.scss';

export type PostProps = {
  key: any;
  name: string;
  relationship?: string;
  profileURL: string;
  imgURL: string;
  isDdabong: boolean;
  content: string;
  updatedAt: string;
  comments: commentDataType[];
};

export default function Home() {
  const postComponents = postData.map((data: postDataType) => {
    return (
      <Post
        key={data.postId}
        name={data.name}
        relationship={data.relationship}
        profileURL={data.profileURL}
        imgURL={data.imgURL}
        isDdabong={data.isDdabong}
        content={data.content}
        updatedAt={data.updatedAt}
        comments={data.comments}
      />
    );
  });

  return (
    <div className={styles.container}>
      {postComponents}
      <Link className={styles.addPostBtn} to={'/addPost'}>
        <AiFillFileAdd />
        <span>글 쓰기</span>
      </Link>
    </div>
  );
}

const postData: postDataType[] = [
  {
    postId: '6298b8b01704e3d4913fe506',
    name: '백xx',
    relationship: '엄마',
    profileURL: '../../assets/images/testProfileMom.jpg',
    imgURL: '../../assets/images/testImg1.jpg',
    isDdabong: false,
    content: '집 앞마당 화단 완성~',
    createdAt: '2022-08-02T13:18:40.193+00:00',
    updatedAt: '2022-08-02T13:18:40.193+00:00',
    comments: [
      {
        commentId: '6398b8b01704e3d4913fe506',
        name: '정xx',
        relationship: '아빠',
        profileURL: '../../assets/images/testProfileDad.jpg',
        comment: '이쁘네...',
        createdAt: '2022-08-02T13:18:40.193+00:00',
        updatedAt: '2022-08-02T13:18:40.193+00:00',
      },
      {
        commentId: '6498b8b01704e3d4913fe506',
        name: '정xx',
        relationship: '누나',
        profileURL: '',
        comment: '우와 잘 했네요~',
        createdAt: '2022-08-04T15:22:10.193+00:00',
        updatedAt: '2022-08-04T15:22:10.193+00:00',
      },
      {
        commentId: '6598b8b01704e3d4913fe506',
        name: '이xx',
        relationship: '',
        profileURL: '',
        comment: '이쁩니다',
        createdAt: '2022-08-05T15:12:10.193+00:00',
        updatedAt: '2022-08-05T15:12:10.193+00:00',
      },
    ],
  },
  {
    postId: '6214b2b01704e3d4913fe526',
    name: '정xx',
    relationship: '아빠',
    profileURL: '../../assets/images/testProfileDad.jpg',
    imgURL: '../../assets/images/testImg2.jpg',
    isDdabong: true,
    content: '비온뒤 연못 정원에서...',
    createdAt: '2022-06-02T13:18:40.193+00:00',
    updatedAt: '2022-06-02T13:18:40.193+00:00',
    comments: [
      {
        commentId: '6391b8b01704e3d4913fe506',
        name: '백xx',
        relationship: '엄마',
        profileURL: '../../assets/images/testProfileMom.jpg',
        comment: '잘 찍었네~',
        createdAt: '2022-06-02T13:18:40.193+00:00',
        updatedAt: '2022-06-02T13:18:40.193+00:00',
      },
      {
        commentId: '6492b8b01704e3d4913fe506',
        name: '정xx',
        relationship: '나',
        profileURL: '../../assets/images/testProfileMe.jpg',
        comment: '오...',
        createdAt: '2022-06-02T15:22:10.193+00:00',
        updatedAt: '2022-06-02T15:22:10.193+00:00',
      },
    ],
  },
];

type postDataType = {
  postId: string;
  name: string;
  relationship?: string;
  profileURL: string;
  imgURL: string;
  isDdabong: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: commentDataType[];
};

export type commentDataType = {
  commentId: string;
  name: string;
  relationship: string;
  profileURL: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
};
